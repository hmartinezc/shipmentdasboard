import { useState, useEffect, useMemo } from 'preact/compat';
import Icon from './icons/Icon';
import CustomSelect from './CustomSelect';
import { RUBRO_OPTIONS, CALCULATION_BASIS_OPTIONS, currencyFormatter } from '../constants';
import type { FinancialItem, TabType, BaseValues, CalculationBasis, RubroOption } from '../types';
import { validators, showValidationError, validateMultiple } from '../utils/validators';

interface AddItemFormProps {
    formType: TabType;
    onAddItem: (item: FinancialItem) => void;
    baseValues: BaseValues;
    rubroOptions?: {
        compraVenta: RubroOption[];
        deductions: RubroOption[];
        commissions: RubroOption[];
    };
}

import type { ComponentChildren } from 'preact';

const FormGroup = ({ label, children }: { label: string; children: ComponentChildren }) => (
    <div className="flex flex-col gap-0.5">
        <label className="text-[9px] text-gray font-bold uppercase tracking-widest">{label}</label>
        {children}
    </div>
);

const renderRubroOption = (option: RubroOption) => {
    let iconName: Parameters<typeof Icon>[0]['name'] | null = null;
    let colorClass = '';
    switch(option.type) {
        case 'compra': iconName = 'arrowDown'; colorClass = 'text-red-600'; break;
        case 'venta': iconName = 'arrowUp'; colorClass = 'text-green-600'; break;
        case 'both': iconName = 'bothArrows'; colorClass = 'text-gray-600'; break;
    }
    return (
        <div className="flex items-center gap-2 min-w-0">
            {iconName && <Icon name={iconName} className={`w-4 h-4 flex-shrink-0 ${colorClass}`} />}
            <span className="truncate">{option.text}</span>
        </div>
    );
};

const AddItemForm = ({ formType, onAddItem, baseValues, rubroOptions }: AddItemFormProps) => {
    const [rubro, setRubro] = useState<RubroOption | null>(null);
    const [baseKey, setBaseKey] = useState<CalculationBasis>('fijo');
    const [valorCompra, setValorCompra] = useState(0);
    const [valorVenta, setValorVenta] = useState(0);
    const [valor, setValor] = useState(0);
    const [extraInfo, setExtraInfo] = useState('');
    
    const [isCompraDisabled, setIsCompraDisabled] = useState(false);
    const [isVentaDisabled, setIsVentaDisabled] = useState(false);

    // Memoize options to avoid re-renders
    const basisOptions = useMemo(() => CALCULATION_BASIS_OPTIONS.map(opt => ({ value: opt.value, text: opt.label })), []);
    const effectiveRubroOptions = rubroOptions || RUBRO_OPTIONS;
    const currentRubroOptions = useMemo(() => effectiveRubroOptions[formType], [formType, effectiveRubroOptions]);


    useEffect(() => {
        setRubro(null);
        setBaseKey('fijo');
        setValorCompra(0);
        setValorVenta(0);
        setValor(0);
        setExtraInfo('');
    }, [formType]);

    useEffect(() => {
        if (formType === 'compraVenta') {
            setIsCompraDisabled(rubro?.type === 'venta');
            setIsVentaDisabled(rubro?.type === 'compra');
            if (rubro?.type === 'venta') setValorCompra(0);
            if (rubro?.type === 'compra') setValorVenta(0);
        }
    }, [rubro, formType]);
    
    const handleSubmit = () => {
        console.log('🔵 handleSubmit called', { rubro, baseKey, valorCompra, valorVenta, formType });
        
        // Validación 1: Rubro es obligatorio
        const rubroValidation = validators.required(rubro, 'El campo Rubro');
        if (!rubroValidation.isValid) {
            console.log('❌ Rubro validation failed');
            showValidationError(rubroValidation.error!);
            return;
        }

        let validationResult;

        if (formType === 'compraVenta') {
            // Validación para compra/venta
            validationResult = validateMultiple([
                validators.validateCompraVenta(valorCompra, valorVenta, rubro?.type),
                validators.positiveNumber(valorCompra >= 0 ? valorCompra : -1, 'Valor de compra'),
                validators.positiveNumber(valorVenta >= 0 ? valorVenta : -1, 'Valor de venta')
            ]);
            console.log('🔵 compraVenta validation:', validationResult);
        } else {
            // Validación para deducciones y comisiones
            validationResult = validators.positiveNumber(valor, 'El valor');
            
            if (validationResult.isValid && valor === 0) {
                validationResult = { isValid: false, error: 'El valor debe ser mayor a 0' };
            }
        }

        if (!validationResult.isValid) {
            console.log('❌ Validation failed:', validationResult.error);
            showValidationError(validationResult.error!);
            return;
        }

        const id = `${formType}-${Date.now()}`;
        console.log('✅ Validation passed, creating item with id:', id);
        let newItem: FinancialItem;

        if (formType === 'compraVenta') {
            newItem = {
                id,
                type: 'compraVenta',
                rubro: rubro!.text,
                rubroValue: rubro!.value,
                rubroType: rubro!.type || 'both',
                baseKey,
                valorCompra,
                valorVenta,
                chargeId: rubro!.chargeId,
                iataCode: rubro!.iataCode
            };
        } else {
             newItem = {
                id,
                type: formType,
                rubro: rubro!.text,
                baseKey,
                valor,
                extraInfo,
                chargeId: rubro!.chargeId,
                iataCode: rubro!.iataCode
            } as FinancialItem;
        }
        
        console.log('🚀 Calling onAddItem with:', newItem);
        onAddItem(newItem);
        console.log('✅ onAddItem called successfully');
        
        // Reset form
        setRubro(null);
        setBaseKey('fijo');
        setValorCompra(0);
        setValorVenta(0);
        setValor(0);
        setExtraInfo('');
    };

    // Crear lookup con todas las claves posibles para evitar undefined
    const baseValuesLookup: Record<string, number> = {
        fijo: baseValues.fijo ?? 1,
        peso_cobrable: baseValues.peso_cobrable ?? 0,
        gross_weight: baseValues.gross_weight ?? 0,
        piezas: baseValues.piezas ?? 0,
        volumen: baseValues.volumen ?? 0,
        freight_charge: baseValues.freight_charge ?? 0,
        due_agent: baseValues.due_agent ?? 0,
        due_carrier: baseValues.due_carrier ?? 0,
        hijas: baseValues.hijas ?? 0,
    };
    const baseValue = baseValuesLookup[baseKey] ?? 0;
    const totalCompra = valorCompra * baseValue;
    const totalVenta = valorVenta * baseValue;
    const totalSimple = valor * baseValue;


    const gridClasses = formType === 'compraVenta'
        ? 'lg:grid-cols-[minmax(140px,_1.4fr)_minmax(90px,_1fr)_minmax(90px,_1fr)_minmax(110px,_1.2fr)_minmax(90px,_1fr)_minmax(90px,_1fr)_auto]'
        : 'lg:grid-cols-[minmax(140px,_1.4fr)_minmax(90px,_1fr)_1.5fr_minmax(110px,_1.2fr)_minmax(90px,_1fr)_auto]';
    
    const inputClasses = "h-[24px] px-2 border border-slate-300 rounded text-[11px] bg-white shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:cursor-not-allowed hover:border-slate-400";

    return (
        <div className={`grid grid-cols-1 md:grid-cols-2 ${gridClasses} gap-1.5 p-1.5 bg-slate-50 rounded-lg border border-slate-200 shadow-sm mb-1.5 items-end`}>
            <FormGroup label="Rubro">
                <CustomSelect
                    options={currentRubroOptions}
                    value={rubro}
                    onChange={setRubro}
                    placeholder="Buscar rubro..."
                    renderOption={renderRubroOption}
                />
            </FormGroup>
            
            {formType === 'compraVenta' ? (
                <>
                    <FormGroup label="Valor Compra">
                        <input type="number" value={valorCompra} onChange={(e) => setValorCompra(parseFloat((e.currentTarget as HTMLInputElement).value) || 0)} disabled={isCompraDisabled} className={inputClasses}/>
                    </FormGroup>
                    <FormGroup label="Valor Venta">
                        <input type="number" value={valorVenta} onChange={(e) => setValorVenta(parseFloat((e.currentTarget as HTMLInputElement).value) || 0)} disabled={isVentaDisabled} className={inputClasses}/>
                    </FormGroup>
                </>
            ) : (
                <>
                    <FormGroup label="Valor">
                        <input type="number" value={valor} onChange={(e) => setValor(parseFloat((e.currentTarget as HTMLInputElement).value) || 0)} className={inputClasses}/>
                    </FormGroup>
                    <FormGroup label={formType === 'deductions' ? 'Descripción' : 'Agente'}>
                        <input type="text" value={extraInfo} onChange={(e) => setExtraInfo((e.currentTarget as HTMLInputElement).value)} className={inputClasses} placeholder="Info adicional..."/>
                    </FormGroup>
                </>
            )}
            
            <FormGroup label="Base de Cálculo">
                <CustomSelect
                    options={basisOptions}
                    value={basisOptions.find(opt => opt.value === baseKey) || null}
                    onChange={(option) => setBaseKey(option?.value as CalculationBasis || 'fijo')}
                />
            </FormGroup>
            
            {formType === 'compraVenta' ? (
                <>
                    <FormGroup label="Total Compra">
                        <div className="h-[24px] px-2 flex items-center text-[11px] font-mono font-bold bg-red-50 text-red-700 rounded border border-red-300">
                            {currencyFormatter.format(totalCompra)}
                        </div>
                    </FormGroup>
                    <FormGroup label="Total Venta">
                         <div className="h-[24px] px-2 flex items-center text-[11px] font-mono font-bold bg-green-50 text-green-700 rounded border border-green-300">
                            {currencyFormatter.format(totalVenta)}
                        </div>
                    </FormGroup>
                </>
            ) : (
                 <FormGroup label="Total">
                    <div className="h-[24px] px-2 flex items-center text-[11px] font-mono font-bold bg-purple-50 text-purple-700 rounded border border-purple-300">
                        {currencyFormatter.format(totalSimple)}
                    </div>
                </FormGroup>
            )}

            <button type="button" onClick={handleSubmit} className="h-[24px] px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-bold text-[11px] flex items-center justify-center gap-1 transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1">
                <Icon name="plus" className="w-3 h-3" />
                <span>Añadir</span>
            </button>
        </div>
    );
};

export default AddItemForm;
