
import Card from './Card';
import Icon from './icons/Icon';
import { currencyFormatter } from '../constants';
import type { Totals } from '../types';

interface FinancialSummaryProps {
    totals: Totals;
}

const SummaryItem = ({ icon, value, label, color, isLast }: { icon: Parameters<typeof Icon>[0]['name']; value: string; label: string; color: string; isLast?: boolean; }) => {
    const colorClasses: Record<string, string> = {
        green: 'bg-emerald-100 text-emerald-700',
        blue: 'bg-slate-100 text-slate-700',
        yellow: 'bg-amber-100 text-amber-700',
        red: 'bg-rose-100 text-rose-700'
    };
    return (
        <div className="text-center p-2 relative" style={{ position: 'relative' }}>
            <div className={`text-xs w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-1.5 shadow-sm ${colorClasses[color]}`}>
                <Icon name={icon} className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold mb-0.5 text-gray-800">{value}</div>
            <div className="text-[9px] text-gray-500 uppercase tracking-wider font-semibold">{label}</div>
            {/* Divisor vertical */}
            <div className="absolute top-1/2 right-0 h-10 w-px" style={{
                transform: 'translateY(-50%)',
                background: 'linear-gradient(to bottom, transparent, #d1d5db, transparent)',
                display: color === 'red' ? 'none' : 'block'
            }}></div>
        </div>
    );
};


const FinancialSummary = ({ totals }: FinancialSummaryProps) => {
    const { totalCobros, totalPagos, totalDeducciones, totalComisiones, utilidad, utilidadPorc } = totals;
    const isPositive = utilidad >= 0;

    return (
        <Card title="Resumen Financiero" icon="chartPie" bodyClassName="p-0">
            <div className="grid grid-cols-4 p-2.5">
                <SummaryItem icon="moneyBillWave" value={currencyFormatter.format(totalCobros)} label="Cobros" color="green" />
                <SummaryItem icon="creditCard" value={currencyFormatter.format(totalPagos)} label="Pagos" color="blue" />
                <SummaryItem icon="minusCircle" value={currencyFormatter.format(totalDeducciones)} label="Deducciones" color="yellow" />
                <SummaryItem icon="commission" value={currencyFormatter.format(totalComisiones)} label="Comisiones" color="red" isLast />
            </div>
            <div style={{
                background: isPositive ? 'linear-gradient(to right, #f0fdf4, #d1fae5)' : 'linear-gradient(to right, #fef2f2, #fff1f2)',
                borderTopColor: isPositive ? '#bbf7d0' : '#fecdd3'
            }} className="p-2 border-t shadow-inner flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                    <Icon name={isPositive ? 'arrowTrendUp' : 'arrowTrendDown'} className={`w-3 h-3 ${isPositive ? 'text-green-600' : 'text-red-600'}`} />
                    <div className="text-xs text-gray-700 font-semibold">Utilidad / Pérdida</div>
                </div>
                <div className="flex items-baseline gap-1.5">
                    <div className={`text-sm font-bold ${isPositive ? 'text-green-700' : 'text-red-700'}`}>{currencyFormatter.format(utilidad)}</div>
                    {utilidadPorc !== undefined && (
                        <div className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isPositive ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{`${isPositive ? '+' : ''}${utilidadPorc.toFixed(2)}%`}</div>
                    )}
                </div>
            </div>
        </Card>
    );
};

export default FinancialSummary;
