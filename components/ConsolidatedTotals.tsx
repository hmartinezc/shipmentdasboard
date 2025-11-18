
import Card from './Card';
import Icon from './icons/Icon';
import { currencyFormatter } from '../constants';
import type { ConsolidatedTotals as ConsolidatedTotalsType } from '../types';

interface ConsolidatedTotalsProps {
    totals: ConsolidatedTotalsType;
}

const ConsolidatedTotals = ({ totals }: ConsolidatedTotalsProps) => {
    return (
        <Card title="Totales Consolidados" icon="chartLine" bodyClassName="p-1.5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
                {/* Total Cobros */}
                <div style={{ background: 'linear-gradient(to bottom right, #dbeafe, #bfdbfe)', borderWidth: '2px', borderColor: '#93c5fd' }} className="rounded-lg p-2 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
                                <Icon name="arrowUp" className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-[9px] font-semibold text-blue-700 uppercase tracking-wide">Total Cobros</span>
                        </div>
                    </div>
                    <div className="font-mono font-bold text-[16px] text-blue-800">
                        {currencyFormatter.format(totals.totalCobros)}
                    </div>
                    <div className="text-[8px] text-blue-600 mt-0.5">
                        {totals.totalShipments} guías procesadas
                    </div>
                </div>

                {/* Total Pagos */}
                <div style={{ background: 'linear-gradient(to bottom right, #fee2e2, #fecaca)', borderWidth: '2px', borderColor: '#fca5a5' }} className="rounded-lg p-2 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                            <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center shadow-md">
                                <Icon name="arrowDown" className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-[9px] font-semibold text-red-700 uppercase tracking-wide">Total Pagos</span>
                        </div>
                    </div>
                    <div className="font-mono font-bold text-[16px] text-red-800">
                        {currencyFormatter.format(totals.totalPagos)}
                    </div>
                </div>

                {/* Utilidad Total */}
                <div style={{
                    background: totals.totalUtilidad >= 0
                        ? 'linear-gradient(to bottom right, #d1fae5, #a7f3d0)'
                        : 'linear-gradient(to bottom right, #ffedd5, #fed7aa)',
                    borderWidth: '2px',
                    borderColor: totals.totalUtilidad >= 0 ? '#6ee7b7' : '#fdba74'
                }} className="rounded-lg p-2 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                            <div className={`w-6 h-6 rounded-full ${
                                totals.totalUtilidad >= 0 ? 'bg-emerald-600' : 'bg-orange-500'
                            } flex items-center justify-center shadow-md`}>
                                <Icon name={totals.totalUtilidad >= 0 ? 'arrowTrendUp' : 'arrowTrendDown'} className="w-3 h-3 text-white" />
                            </div>
                            <span className={`text-[9px] font-semibold ${
                                totals.totalUtilidad >= 0 ? 'text-emerald-700' : 'text-orange-700'
                            } uppercase tracking-wide`}>Utilidad Total</span>
                        </div>
                    </div>
                    <div className={`font-mono font-bold text-[16px] ${
                        totals.totalUtilidad >= 0 ? 'text-emerald-700' : 'text-orange-800'
                    }`}>
                        {currencyFormatter.format(totals.totalUtilidad)}
                    </div>
                    <div className={`text-[8px] ${
                        totals.totalUtilidad >= 0 ? 'text-emerald-700' : 'text-orange-600'
                    } mt-0.5 font-semibold`}>
                        {totals.totalUtilidadPorc !== undefined ? `${totals.totalUtilidadPorc.toFixed(1)}% margen` : '-- margen'}
                    </div>
                </div>
            </div>

            {/* Status Summary */}
            <div style={{ borderTopColor: '#e5e7eb' }} className="mt-2 pt-2 border-t">
                <div className="flex items-center justify-between text-[9px]">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                            <span style={{ borderColor: '#86efac' }} className="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-semibold bg-green-100 text-green-700">
                                <Icon name="checkCircle" className="w-3 h-3" />
                                Válidas: {totals.validCount}
                            </span>
                        </div>
                        {totals.warningCount > 0 && (
                            <div className="flex items-center gap-1">
                                <span style={{ borderColor: '#fde047' }} className="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-semibold bg-yellow-100 text-yellow-700">
                                    <Icon name="exclamationTriangle" className="w-3 h-3" />
                                    Advertencias: {totals.warningCount}
                                </span>
                            </div>
                        )}
                        {totals.errorCount > 0 && (
                            <div className="flex items-center gap-1">
                                <span style={{ borderColor: '#fecaca' }} className="inline-flex items-center gap-1 px-2 py-0.5 rounded border text-[9px] font-semibold bg-red-100 text-red-700">
                                    <Icon name="timesCircle" className="w-3 h-3" />
                                    Errores: {totals.errorCount}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ConsolidatedTotals;
