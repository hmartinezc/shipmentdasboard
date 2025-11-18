
import { useState, useEffect, useRef } from 'preact/compat';
import Icon from './icons/Icon';
import Card from './Card';
import AddItemForm from './AddItemForm';
import { currencyFormatter } from '../constants';
import type { FinancialItem, CompraVentaItem, DeductionItem, CommissionItem, TabType, BaseValues, RubroOption } from '../types';

interface FinancialDetailsProps {
    items: {
        compraVenta: CompraVentaItem[];
        deductions: DeductionItem[];
        commissions: CommissionItem[];
    };
    actions: {
        addItem: (item: FinancialItem) => void;
        deleteItem: (id: string, type: TabType) => void;
    };
    baseValues: BaseValues;
    rubroOptions?: {
        compraVenta: RubroOption[];
        deductions: RubroOption[];
        commissions: RubroOption[];
    };
}

const TabButton = ({ icon, label, isActive, onClick, tabType }: { icon: Parameters<typeof Icon>[0]['name']; label: string; isActive: boolean; onClick: () => void; tabType: 'compraVenta' | 'deductions' | 'commissions'; }) => {
    // Usar clases directas de Tailwind estándar o colores con hex
    let activeClasses = '';
    let borderClass = '';
    
    if (isActive) {
        if (tabType === 'compraVenta') {
            activeClasses = 'text-purple-600 font-semibold bg-purple-100 rounded-t';
            borderClass = 'bg-purple-600';
        } else if (tabType === 'deductions') {
            activeClasses = 'text-[#f59e0b] font-semibold bg-orange-100 rounded-t';
            borderClass = 'bg-[#f59e0b]';
        } else if (tabType === 'commissions') {
            activeClasses = 'text-[#ef4444] font-semibold bg-red-100 rounded-t';
            borderClass = 'bg-[#ef4444]';
        }
    } else {
        activeClasses = 'text-gray font-medium bg-transparent hover:bg-slate-50';
    }
    
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-2.5 py-1 text-[11px] flex items-center gap-1 border-none cursor-pointer relative transition-all ${activeClasses}`}
        >
            <Icon name={icon} className="w-3 h-3" />
            {label}
            {isActive && <span className={`absolute bottom-[-1px] left-0 w-full h-0.5 ${borderClass}`}></span>}
        </button>
    );
};

const PlaceholderRow = ({ message, colSpan }: { message: string; colSpan: number }) => (
    <tr className="placeholder-row">
        <td colSpan={colSpan} className="p-3 bg-slate-50">
            <div className="flex items-center justify-center gap-2 text-center min-h-[52px]">
                <Icon name="empty" className="w-5 h-5 opacity-50" />
                <span className="text-[10px] text-gray-500 font-medium tracking-wide">{message}</span>
            </div>
        </td>
    </tr>
);

const FinancialDetails = ({ items, actions, baseValues, rubroOptions }: FinancialDetailsProps) => {
    const [activeTab, setActiveTab] = useState<TabType>('compraVenta');
    
    const compraTbodyRef = useRef<HTMLTableSectionElement>(null);
    const ventaTbodyRef = useRef<HTMLTableSectionElement>(null);
    
    useEffect(() => {
        if (activeTab !== 'compraVenta') return;
        
        const compraRows = Array.from(compraTbodyRef.current?.children || []) as HTMLTableRowElement[];
        const ventaRows = Array.from(ventaTbodyRef.current?.children || []) as HTMLTableRowElement[];
        
        compraRows.forEach(row => row.style.height = 'auto');
        ventaRows.forEach(row => row.style.height = 'auto');

        requestAnimationFrame(() => {
            const count = Math.min(compraRows.length, ventaRows.length);
            for (let i = 0; i < count; i++) {
                if (compraRows[i].classList.contains('placeholder-row')) continue;
                const maxHeight = Math.max(28, compraRows[i].offsetHeight, ventaRows[i].offsetHeight);
                compraRows[i].style.height = `${maxHeight}px`;
                ventaRows[i].style.height = `${maxHeight}px`;
            }
        });
    }, [items.compraVenta, activeTab]);

    const renderCompraVenta = () => (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="border border-slate-300 rounded-lg overflow-hidden bg-white flex flex-col h-full shadow-sm">
                <h3 style={{ background: 'linear-gradient(to right, #fff1f2, #ffffff)', borderBottomColor: '#fecdd3' }} className="text-[11px] font-semibold p-1.5 text-danger border-b flex items-center gap-1">
                    <Icon name="arrowTrendDown" className="w-3 h-3 text-danger" /> Rubros Compra (Pagos)
                </h3>
                <table className="w-full border-collapse text-xs">
                    <thead>
                        <tr style={{ background: 'linear-gradient(to right, #fff1f2, #ffe4e6)', borderBottomColor: '#fecdd3' }} className="border-b">
                            <th className="p-1.5 text-left font-semibold text-gray text-[9px] h-7 tracking-widest uppercase">Rubro</th>
                            <th className="p-1.5 text-right font-semibold text-gray text-[9px] tracking-widest uppercase">Valor</th>
                            <th className="p-1.5 text-right font-semibold text-gray text-[9px] tracking-widest uppercase">V.Tot</th>
                        </tr>
                    </thead>
                    <tbody ref={compraTbodyRef}>
                        {items.compraVenta.length === 0 ? <PlaceholderRow message="No hay rubros de compra." colSpan={3} /> : items.compraVenta.map(item => {
                            const totalCompra = item.valorCompra * baseValues[item.baseKey];
                            return <tr key={item.id} data-id={item.id} style={{ borderBottomWidth: '1px', borderBottomColor: '#f3f4f6' }} className="last:border-b-0 align-middle h-7">
                                <td className="p-1.5 text-[11px] text-primary">{item.rubro}</td>
                                <td className="p-1.5 text-right font-mono font-semibold text-[11px] text-gray-800">{currencyFormatter.format(item.valorCompra)}</td>
                                <td className="p-1.5 text-right font-mono font-semibold text-[11px] text-gray-800">{currencyFormatter.format(totalCompra)}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            <div className="border border-slate-300 rounded-lg overflow-hidden bg-white flex flex-col h-full shadow-sm">
                      <h3 style={{ background: 'linear-gradient(to right, #d1fae5, #ffffff)', borderBottomColor: '#a7f3d0' }} className="text-[11px] font-semibold p-1.5 text-success border-b flex items-center gap-1">
                          <Icon name="arrowTrendUp" className="w-3 h-3 text-success" /> Rubros Venta (Cobros)
                </h3>
                <table className="w-full border-collapse text-xs">
                     <thead>
                        <tr style={{ background: 'linear-gradient(to right, #d1fae5, #a7f3d0)', borderBottomColor: '#6ee7b7' }} className="border-b">
                            <th className="p-1.5 text-left font-semibold text-gray text-[9px] h-7 tracking-widest uppercase">Rubro</th>
                            <th className="p-1.5 text-right font-semibold text-gray text-[9px] tracking-widest uppercase">Valor</th>
                            <th className="p-1.5 text-right font-semibold text-gray text-[9px] tracking-widest uppercase">V.Tot</th>
                            <th className="p-1.5 text-right font-semibold text-gray text-[9px] tracking-widest uppercase">Utilidad</th>
                            <th className="p-1.5 text-center font-semibold text-gray text-[9px] tracking-widest uppercase">Acciones</th>
                        </tr>
                    </thead>
                    <tbody ref={ventaTbodyRef}>
                         {items.compraVenta.length === 0 ? <PlaceholderRow message="No hay rubros de venta." colSpan={5} /> : items.compraVenta.map(item => {
                            const totalCompra = item.valorCompra * baseValues[item.baseKey];
                            const totalVenta = item.valorVenta * baseValues[item.baseKey];
                            const utilidad = totalVenta - totalCompra;
                            return <tr key={item.id} data-id={item.id} style={{ borderBottomWidth: '1px', borderBottomColor: '#f3f4f6' }} className="last:border-b-0 align-middle h-7">
                                <td className="p-1.5 text-[11px] text-primary">{item.rubro}</td>
                                <td className="p-1.5 text-right font-mono font-semibold text-[11px] text-gray-800">{currencyFormatter.format(item.valorVenta)}</td>
                                <td className="p-1.5 text-right font-mono font-semibold text-[11px] text-gray-800">{currencyFormatter.format(totalVenta)}</td>
                                <td className={`p-1.5 text-right font-mono font-semibold text-[11px] ${utilidad >= 0 ? 'text-success' : 'text-danger'}`}>{currencyFormatter.format(utilidad)}</td>
                                <td className="p-1.5 text-center"><button type="button" onClick={() => actions.deleteItem(item.id, 'compraVenta')} className="bg-transparent border border-slate-200 rounded w-5 h-5 flex items-center justify-center cursor-pointer text-[10px] text-slate-400 hover:text-red-500 hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-1 focus:ring-red-400 mx-auto transition-all"><Icon name="trash" className="w-3 h-3" /></button></td>
                            </tr>
                         })}
                    </tbody>
                </table>
            </div>
        </div>
    );
    
    const renderSimpleTable = (type: 'deductions' | 'commissions', title: string, icon: string, color: string) => {
        const valueColor = type === 'commissions' ? 'text-danger' : 'text-warning';
        return (
        <div className="border border-slate-300 rounded-lg overflow-hidden bg-white flex flex-col h-full shadow-sm">
            <h3 className={`text-[11px] font-semibold p-1.5 text-primary bg-slate-50 border-b border-slate-200 flex items-center gap-1 ${color}`}>
                <Icon name={icon as Parameters<typeof Icon>[0]['name']} className="w-3 h-3" /> {title}
            </h3>
            <table className="w-full border-collapse text-xs">
                <thead><tr className="bg-slate-50"><th className="p-1.5 text-left font-semibold text-gray text-[9px] h-7 tracking-widest uppercase">Rubro</th><th className="p-1.5 text-right font-semibold text-gray text-[9px] tracking-widest uppercase">Valor</th><th className="p-1.5 text-right font-semibold text-gray text-[9px] tracking-widest uppercase">Total</th><th className="p-1.5 text-left font-semibold text-gray text-[9px] tracking-widest uppercase">{type === 'deductions' ? 'Descripción' : 'Agente'}</th><th className="p-1.5 text-center font-semibold text-gray text-[9px] tracking-widest uppercase">Acciones</th></tr></thead>
                <tbody>
                    {items[type].length === 0 ? <PlaceholderRow message={`No hay ${type} registradas.`} colSpan={5} /> : (items[type] as (DeductionItem | CommissionItem)[]).map(item => {
                        const total = item.valor * baseValues[item.baseKey];
                        return <tr key={item.id} data-id={item.id} style={{ borderBottomWidth: '1px', borderBottomColor: '#f3f4f6' }} className="last:border-b-0 align-middle h-7">
                            <td className="p-1.5 text-[11px] text-primary">{item.rubro}</td>
                            <td className={`p-1.5 text-right font-mono font-semibold text-[11px] ${valueColor}`}>{currencyFormatter.format(item.valor)}</td>
                            <td className={`p-1.5 text-right font-mono font-semibold text-[11px] ${valueColor}`}>{currencyFormatter.format(total)}</td>
                            <td className="p-1.5 text-[11px] text-primary">{item.extraInfo || '-'}</td>
                            <td className="p-1.5 text-center"><button type="button" onClick={() => actions.deleteItem(item.id, type)} className="bg-transparent border border-slate-200 rounded w-5 h-5 flex items-center justify-center cursor-pointer text-[10px] text-slate-400 hover:text-red-500 hover:border-red-300 hover:bg-red-50 focus:outline-none focus:ring-1 focus:ring-red-400 mx-auto transition-all"><Icon name="trash" className="w-3 h-3" /></button></td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    );
    };
    
    return (
        <Card title="Detalles Financieros" icon="fileInvoice">
            <div className="flex border-b border-gray-200 bg-slate-50 rounded-t-md px-0.5">
                <TabButton 
                    icon="bothArrows" 
                    label="Compra y Venta" 
                    isActive={activeTab === 'compraVenta'} 
                    onClick={() => setActiveTab('compraVenta')}
                    tabType="compraVenta"
                />
                <TabButton 
                    icon="minusCircle" 
                    label="Deducciones" 
                    isActive={activeTab === 'deductions'} 
                    onClick={() => setActiveTab('deductions')}
                    tabType="deductions"
                />
                <TabButton 
                    icon="commission" 
                    label="Comisiones" 
                    isActive={activeTab === 'commissions'} 
                    onClick={() => setActiveTab('commissions')}
                    tabType="commissions"
                />
            </div>
            <div className="pt-2">
                <AddItemForm formType={activeTab} onAddItem={actions.addItem} baseValues={baseValues} rubroOptions={rubroOptions} />
                {activeTab === 'compraVenta' && renderCompraVenta()}
                {activeTab === 'deductions' && renderSimpleTable('deductions', 'Deducciones', 'minusCircle', 'text-warning')}
                {activeTab === 'commissions' && renderSimpleTable('commissions', 'Comisiones', 'commission', 'text-danger')}
            </div>
        </Card>
    );
};

export default FinancialDetails;
