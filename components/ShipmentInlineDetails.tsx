import { memo } from 'preact/compat';
import Card from './Card';
import Icon from './icons/Icon';
import { currencyFormatter } from '../constants';
import type { ShipmentSummary } from '../types';

interface ShipmentInlineDetailsProps {
    shipment: ShipmentSummary;
    onViewFullDetails?: (shipmentId: string) => void;
}

const ShipmentInlineDetails = ({ shipment, onViewFullDetails }: ShipmentInlineDetailsProps) => {
    const policy = shipment.policyRule;
    const diff = shipment.totalCobros - shipment.totalPagos;
    const isPositive = diff >= 0;
    const hasAlert = shipment.status !== 'valid';
    const alertStyle = shipment.status === 'warning'
        ? { background: 'linear-gradient(to right, #fffbeb, #fef9c3)', borderColor: '#fde68a', color: '#92400e' }
        : { background: 'linear-gradient(to right, #fff1f2, #fef2f2)', borderColor: '#fecdd3', color: '#9f1239' };
    const alertIcon = shipment.status === 'warning' ? 'triangleExclamation' : 'circleExclamation';
    const alertTitle = shipment.status === 'warning' ? 'Advertencia' : 'Error';

    return (
        <div className="p-2 bg-white/70 rounded-lg">
            {hasAlert && (
                <div style={alertStyle} className="mb-2 p-2 rounded-md border flex items-start gap-2"> 
                    <Icon name={alertIcon} className="w-3 h-3 mt-0.5 text-current" />
                    <div className="flex-1">
                        <div className="font-bold text-[11px] leading-none">{alertTitle}</div>
                        <div className="text-[11px] leading-snug">{shipment.statusMessage || 'Revisa las condiciones de la política o los importes.'}</div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <Card title="Política Aplicada" icon="shieldAlt">
                    <div className="grid grid-cols-2 gap-y-1 text-[11px]">
                        <div className="text-gray-500">Regla:</div>
                        <div className="text-right font-mono font-semibold text-blue-700">{policy.ruleNumber}</div>

                        <div className="text-gray-500">Carrier:</div>
                        <div className="text-right font-semibold text-gray-700">{policy.carrier}</div>

                        <div className="text-gray-500">Season:</div>
                        <div className="text-right font-semibold text-gray-700">{policy.season}</div>

                        <div className="text-gray-500">Sales Rep:</div>
                        <div className="text-right font-semibold text-gray-700">{policy.salesRep}</div>
                    </div>
                </Card>

                <Card title="Resumen Financiero" icon="coins">
                    <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                                <Icon name="arrowTrendUp" className="w-3 h-3 text-emerald-700" />
                                Cobros:
                            </div>
                            <div className="font-mono font-bold text-emerald-700">{currencyFormatter.format(shipment.totalCobros)}</div>
                        </div>
                        <div className="flex items-center justify-between text-[11px]">
                            <div className="flex items-center gap-1.5 text-rose-700 font-semibold">
                                <Icon name="arrowTrendDown" className="w-3 h-3 text-rose-700" />
                                Pagos:
                            </div>
                            <div className="font-mono font-bold text-rose-700">{currencyFormatter.format(shipment.totalPagos)}</div>
                        </div>
                        <div className={`mt-2 p-2 rounded-md border text-[11px] flex items-center justify-between ${isPositive ? 'bg-green-50 border-green-200' : 'bg-rose-50 border-rose-200'}`}>
                            <div className="text-gray-700 font-semibold">Diferencia:</div>
                            <div className={`font-mono font-bold ${isPositive ? 'text-green-700' : 'text-rose-700'}`}>{currencyFormatter.format(diff)}</div>
                        </div>
                    </div>
                </Card>
            </div>

            {onViewFullDetails && (
                <div className="mt-2 flex justify-center">
                    <button
                        type="button"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-[10px] font-bold cursor-pointer shadow-sm flex items-center gap-1.5"
                        onClick={() => onViewFullDetails(shipment.id)}
                    >
                        <Icon name="eye" className="w-3 h-3" />
                        <span>Ver Detalle Completo</span>
                    </button>
                </div>
            )}
        </div>
    );
};

// ✅ OPTIMIZACIÓN: Memoizar para evitar re-renders cuando otras filas cambian
export default memo(ShipmentInlineDetails, (prev, next) => {
    return (
        prev.shipment.id === next.shipment.id &&
        prev.shipment.totalCobros === next.shipment.totalCobros &&
        prev.shipment.totalPagos === next.shipment.totalPagos &&
        prev.shipment.status === next.shipment.status
    );
});
