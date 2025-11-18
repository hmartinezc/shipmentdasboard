
import { useState, useMemo, useCallback, useEffect, useReducer } from 'preact/compat';
import { INITIAL_GENERAL_INFO } from '../constants';
import { apiService } from '../services/apiService';
import { DEMO_CONFIG } from '../data/mockData';
import type { GeneralInfo, GeneralInfoKey, CompraVentaItem, DeductionItem, CommissionItem, FinancialItem, TabType, BaseValues, Totals } from '../types';

// ✅ OPTIMIZACIÓN 1: Reducer para estado consolidado (reduce re-renders)
type FinancialState = {
    compraVenta: CompraVentaItem[];
    deductions: DeductionItem[];
    commissions: CommissionItem[];
};

type FinancialAction = 
    | { type: 'SET_ALL'; payload: FinancialState }
    | { type: 'ADD_ITEM'; item: FinancialItem }
    | { type: 'DELETE_ITEM'; id: string; itemType: TabType };

const financialReducer = (state: FinancialState, action: FinancialAction): FinancialState => {
    switch (action.type) {
        case 'SET_ALL':
            return action.payload;
        case 'ADD_ITEM':
            const { item } = action;
            if (item.type === 'compraVenta') {
                return { ...state, compraVenta: [...state.compraVenta, item] };
            } else if (item.type === 'deductions') {
                return { ...state, deductions: [...state.deductions, item] };
            } else {
                return { ...state, commissions: [...state.commissions, item] };
            }
        case 'DELETE_ITEM':
            const { id, itemType } = action;
            if (itemType === 'compraVenta') {
                return { ...state, compraVenta: state.compraVenta.filter(i => i.id !== id) };
            } else if (itemType === 'deductions') {
                return { ...state, deductions: state.deductions.filter(i => i.id !== id) };
            } else {
                return { ...state, commissions: state.commissions.filter(i => i.id !== id) };
            }
        default:
            return state;
    }
};

type InitialFinancials = {
    generalInfo?: GeneralInfo;
    compraVentaItems?: CompraVentaItem[];
    deductionItems?: DeductionItem[];
    commissionItems?: CommissionItem[];
    disableAutoLoad?: boolean;
};

const useFinancials = (initialData?: InitialFinancials) => {
    const initialGeneral = initialData?.generalInfo || INITIAL_GENERAL_INFO;
    const initialCompraVenta = initialData?.compraVentaItems || [];
    const initialDeductions = initialData?.deductionItems || [];
    const initialCommissions = initialData?.commissionItems || [];

    const [generalInfo, setGeneralInfo] = useState<GeneralInfo>(initialGeneral);
    const [financialState, dispatch] = useReducer(financialReducer, {
        compraVenta: initialCompraVenta,
        deductions: initialDeductions,
        commissions: initialCommissions
    });
    const [isLoading, setIsLoading] = useState(false);

    // Cargar datos iniciales (desde API o mock)
    useEffect(() => {
        const initializedFromProps = Boolean(
            initialData?.generalInfo ||
            initialData?.compraVentaItems ||
            initialData?.deductionItems ||
            initialData?.commissionItems
        );
        const shouldAutoLoad = !initialData?.disableAutoLoad && !initializedFromProps && DEMO_CONFIG.useMockData;

        const loadInitialData = async () => {
            if (!shouldAutoLoad) return;
            setIsLoading(true);
            try {
                const [info, cvItems, dedItems, comItems] = await Promise.all([
                    apiService.getGeneralInfo(),
                    apiService.getCompraVentaItems(),
                    apiService.getDeductionItems(),
                    apiService.getCommissionItems()
                ]);

                setGeneralInfo(info);
                dispatch({
                    type: 'SET_ALL',
                    payload: {
                        compraVenta: cvItems,
                        deductions: dedItems,
                        commissions: comItems
                    }
                });
            } catch (error) {
                console.error('Error cargando datos:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
        // We intentionally depend only on flags and not on dispatch references
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData?.disableAutoLoad]);

    // ✅ OPTIMIZACIÓN 2: useCallback con dependencias correctas
    const updateGeneralInfo = useCallback(async (key: GeneralInfoKey, value: string | number) => {
        setGeneralInfo(prev => {
            const updated = { ...prev, [key]: value };
            
            // Enviar al backend en background (no bloqueante)
            apiService.updateGeneralInfo(updated).catch(err => 
                console.error('Error actualizando info:', err)
            );
            
            return updated;
        });
    }, []);

    const addItem = useCallback(async (item: FinancialItem) => {
        // Primero agregar localmente para UI responsiva
        dispatch({ type: 'ADD_ITEM', item });
        
        // Enviar al backend en background
        try {
            await apiService.addItem(item);
        } catch (error) {
            console.error('Error agregando item:', error);
            // TODO: Revertir cambio local en caso de error
        }
    }, []);

    const deleteItem = useCallback(async (id: string, type: TabType) => {
        // Primero eliminar localmente
        dispatch({ type: 'DELETE_ITEM', id, itemType: type });
        
        // Enviar al backend en background
        try {
            await apiService.deleteItem(id, type);
        } catch (error) {
            console.error('Error eliminando item:', error);
            // TODO: Revertir cambio local en caso de error
        }
    }, []);

    // ✅ OPTIMIZACIÓN 3: Memoización selectiva de baseValues
    const baseValues = useMemo<BaseValues>(() => ({
        fijo: 1,
        peso_cobrable: Number(generalInfo.pesoCobrable) || 0,
        gross_weight: Number(generalInfo.grossWeight) || 0,
        piezas: Number(generalInfo.piezas) || 0,
        volumen: Number(generalInfo.volumen) || 0,
        freight_charge: Number(generalInfo.freightCharge) || 0,
        due_agent: Number(generalInfo.dueAgent) || 0,
        due_carrier: Number(generalInfo.dueCarrier) || 0,
    }), [generalInfo.pesoCobrable, generalInfo.grossWeight, generalInfo.piezas, generalInfo.volumen, generalInfo.freightCharge, generalInfo.dueAgent, generalInfo.dueCarrier]);

    // ✅ OPTIMIZACIÓN 4: Cálculos optimizados con reduce memoizado
    const totals = useMemo<Totals>(() => {
        const { compraVenta, deductions, commissions } = financialState;
        const { fijo, peso_cobrable, gross_weight, piezas, volumen, freight_charge, due_agent, due_carrier } = baseValues;
        
        // Pre-calcular lookup table para mejor performance
        const baseValuesLookup = { fijo, peso_cobrable, gross_weight, piezas, volumen, freight_charge, due_agent, due_carrier };
        
        const totalCobros = compraVenta.reduce((acc, item) => 
            acc + (item.valorVenta * baseValuesLookup[item.baseKey]), 0);
        
        const totalPagos = compraVenta.reduce((acc, item) => 
            acc + (item.valorCompra * baseValuesLookup[item.baseKey]), 0);
        
        const totalDeducciones = deductions.reduce((acc, item) => 
            acc + (item.valor * baseValuesLookup[item.baseKey]), 0);
        
        const totalComisiones = commissions.reduce((acc, item) => 
            acc + (item.valor * baseValuesLookup[item.baseKey]), 0);
        
        const utilidad = totalCobros - totalPagos - totalDeducciones - totalComisiones;
        const totalCostos = totalPagos + totalDeducciones + totalComisiones;
        const utilidadPorc = totalCostos > 0 ? (utilidad / totalCostos) * 100 : (totalCobros > 0 ? 100 : 0);
        
        return { totalCobros, totalPagos, totalDeducciones, totalComisiones, utilidad, utilidadPorc };
    }, [financialState, baseValues]);

    return {
        generalInfo,
        updateGeneralInfo,
        compraVentaItems: financialState.compraVenta,
        deductionItems: financialState.deductions,
        commissionItems: financialState.commissions,
        addItem,
        deleteItem,
        baseValues,
        totals,
        isLoading
    };
};

export default useFinancials;
