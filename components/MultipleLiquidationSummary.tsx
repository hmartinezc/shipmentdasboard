
import { useState, useMemo, useCallback, Fragment } from 'preact/compat';
import Icon from './icons/Icon';
import Card from './Card';
import ConsolidatedTotals from './ConsolidatedTotals';
import ShipmentTableRow from './ShipmentTableRow';
import ShipmentInlineDetails from './ShipmentInlineDetails';
import InfoGrid from './InfoGrid';
import FinancialSummary from './FinancialSummary';
import FinancialDetails from './FinancialDetails';
import RulesSummary from './RulesSummary';
import type { ShipmentSummary, ConsolidatedTotals as ConsolidatedTotalsType, ViewMode } from '../types';

interface MultipleLiquidationSummaryProps {
    shipments: ShipmentSummary[];
    onViewModeChange?: (mode: ViewMode) => void;
}

const MultipleLiquidationSummary = ({ shipments, onViewModeChange }: MultipleLiquidationSummaryProps) => {
    const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
    const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
    const [detailViewMode, setDetailViewMode] = useState<'liquidacion' | 'politicas'>('liquidacion');

    // ✅ OPTIMIZACIÓN: Calcular totales consolidados solo cuando cambia shipments
    const consolidatedTotals = useMemo<ConsolidatedTotalsType>(() => {
        const totals = shipments.reduce((acc, ship) => {
            acc.totalShipments++;
            acc.totalCobros += ship.totalCobros;
            acc.totalPagos += ship.totalPagos;
            acc.totalUtilidad += ship.utilidad;
            
            // Conteo por status optimizado
            if (ship.status === 'valid') acc.validCount++;
            else if (ship.status === 'warning') acc.warningCount++;
            else if (ship.status === 'error') acc.errorCount++;
            
            return acc;
        }, {
            totalShipments: 0,
            totalCobros: 0,
            totalPagos: 0,
            totalUtilidad: 0,
            totalUtilidadPorc: 0,
            validCount: 0,
            warningCount: 0,
            errorCount: 0
        });
        
        // Calcular porcentaje después del reduce
        totals.totalUtilidadPorc = totals.totalCobros > 0 
            ? (totals.totalUtilidad / totals.totalCobros) * 100 
            : 0;
        
        return totals;
    }, [shipments]);

    // ✅ OPTIMIZACIÓN: Usar useMemo para shipment seleccionado
    const selectedShipment = useMemo(() => 
        shipments.find(s => s.id === selectedShipmentId),
        [shipments, selectedShipmentId]
    );

    // ✅ OPTIMIZACIÓN: useCallback para event handlers
    // Click en fila ahora expande/colapsa detalle inline
    const handleToggleInline = useCallback((shipmentId: string) => {
        setExpandedRowId(prev => (prev === shipmentId ? null : shipmentId));
    }, []);

    // Apertura del detalle completo desde el panel inline
    const handleOpenFullDetails = useCallback((shipmentId: string) => {
        setSelectedShipmentId(shipmentId);
        setDetailViewMode('liquidacion');
        onViewModeChange?.('detalle');
    }, [onViewModeChange]);

    // Sin pre-detalle inline: como estaba antes

    const handleBackToSummary = useCallback(() => {
        setSelectedShipmentId(null);
        onViewModeChange?.('resumen');
    }, [onViewModeChange]);

    const handleNavigate = useCallback((direction: 'prev' | 'next') => {
        const currentIndex = shipments.findIndex(s => s.id === selectedShipmentId);
        let newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
        
        if (newIndex < 0) newIndex = shipments.length - 1;
        if (newIndex >= shipments.length) newIndex = 0;
        
        setSelectedShipmentId(shipments[newIndex].id);
    }, [shipments, selectedShipmentId]);

    // Detail View (Individual Shipment)
    if (selectedShipment) {
        const currentIndex = shipments.findIndex(s => s.id === selectedShipmentId);
        const baseValues = {
            fijo: 1,
            peso_cobrable: selectedShipment.generalInfo.pesoCobrable as number,
            gross_weight: selectedShipment.generalInfo.grossWeight as number,
            piezas: selectedShipment.generalInfo.piezas as number
        };

        const totals = {
            totalCobros: selectedShipment.totalCobros,
            totalPagos: selectedShipment.totalPagos,
            totalDeducciones: selectedShipment.deductionItems.reduce((sum, item) => sum + (item.valor * baseValues[item.baseKey]), 0),
            totalComisiones: selectedShipment.commissionItems.reduce((sum, item) => sum + (item.valor * baseValues[item.baseKey]), 0),
            utilidad: selectedShipment.utilidad,
            utilidadPorc: selectedShipment.utilidadPorc
        };

        return (
            <div className="space-y-1.5">
                {/* Navigation Bar */}
                <Card title="" icon="">
                    <div style={{ background: 'linear-gradient(to right, #eff6ff, #eef2ff)', borderColor: '#bfdbfe' }} className="flex items-center justify-between p-2 rounded-lg border">
                        <button
                            type="button"
                            onClick={handleBackToSummary}
                            className="bg-white hover:bg-blue-50 text-blue-700 px-3 py-1.5 rounded border border-blue-300 text-[10px] font-semibold transition-colors shadow-sm flex items-center gap-1.5"
                        >
                            <Icon name="arrowLeft" className="w-3 h-3" />
                            Volver a Resumen
                        </button>

                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => handleNavigate('prev')}
                                className="bg-white hover:bg-gray-100 text-gray-700 w-8 h-8 rounded border border-gray-300 text-[10px] font-semibold transition-colors shadow-sm flex items-center justify-center"
                            >
                                <Icon name="chevronLeft" className="w-3 h-3" />
                            </button>
                            
                            <div className="text-center">
                                <div className="text-[9px] text-gray-500 font-medium">Guía</div>
                                <div className="font-mono font-bold text-[12px] text-blue-700">
                                    {currentIndex + 1} / {shipments.length}
                                </div>
                                <div className="text-[10px] text-gray-600 font-semibold">{selectedShipment.awb}</div>
                            </div>

                            <button
                                type="button"
                                onClick={() => handleNavigate('next')}
                                className="bg-white hover:bg-gray-100 text-gray-700 w-8 h-8 rounded border border-gray-300 text-[10px] font-semibold transition-colors shadow-sm flex items-center justify-center"
                            >
                                <Icon name="chevronRight" className="w-3 h-3" />
                            </button>
                        </div>

                        <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm rounded-lg p-0.5 border border-blue-200">
                            <button
                                type="button"
                                onClick={() => setDetailViewMode('liquidacion')}
                                className={`px-3 py-1.5 rounded-md text-[10px] font-semibold transition-all flex items-center gap-1.5 ${
                                    detailViewMode === 'liquidacion' 
                                        ? 'bg-blue-600 text-white shadow-md' 
                                        : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                                }`}
                            >
                                <Icon name="calculator" className="w-3 h-3" />
                                Liquidación
                            </button>
                            <button
                                type="button"
                                onClick={() => setDetailViewMode('politicas')}
                                className={`px-3 py-1.5 rounded-md text-[10px] font-semibold transition-all flex items-center gap-1.5 ${
                                    detailViewMode === 'politicas' 
                                        ? 'bg-blue-600 text-white shadow-md' 
                                        : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'
                                }`}
                            >
                                <Icon name="fileContract" className="w-3 h-3" />
                                Políticas
                            </button>
                        </div>
                    </div>
                </Card>

                {/* Detail Content */}
                <div className="grid grid-cols-1 lg:grid-cols-[32%_1fr] gap-1.5">
                    <div className="flex flex-col gap-1.5">
                        <InfoGrid
                            generalInfo={selectedShipment.generalInfo}
                            updateGeneralInfo={() => {}}
                            totals={totals}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        {detailViewMode === 'liquidacion' ? (
                            <>
                                <FinancialSummary totals={totals} />
                                <FinancialDetails
                                    items={{
                                        compraVenta: selectedShipment.compraVentaItems,
                                        deductions: selectedShipment.deductionItems,
                                        commissions: selectedShipment.commissionItems
                                    }}
                                    actions={{
                                        addItem: () => {},
                                        deleteItem: () => {}
                                    }}
                                    baseValues={baseValues}
                                />
                            </>
                        ) : (
                            <RulesSummary rule={selectedShipment.policyRule} />
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // Summary View (Multiple Shipments Table)
    return (
        <div className="space-y-1.5">
            <ConsolidatedTotals totals={consolidatedTotals} />

            <Card title={`Guías a Liquidar (${shipments.length})`} icon="boxesStacked">
                <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                    <table className="w-full border-collapse text-xs">
                        <thead style={{ background: 'linear-gradient(to right, #f1f5f9, #f8fafc)', borderBottomColor: '#bfdbfe' }} className="sticky top-0 border-b-2 z-10">
                            <tr>
                                <th className="px-1.5 py-1.5 text-center font-semibold text-gray-700 text-[9px]">#</th>
                                <th className="px-1.5 py-1.5 text-left font-semibold text-gray-700 text-[9px]">AWB</th>
                                <th className="px-1.5 py-1.5 text-left font-semibold text-gray-700 text-[9px]">Consignee</th>
                                <th className="px-1.5 py-1.5 text-right font-semibold text-gray-700 text-[9px]">Peso</th>
                                <th className="px-1.5 py-1.5 text-center font-semibold text-gray-700 text-[9px]">Regla</th>
                                <th className="px-1.5 py-1.5 text-right font-semibold text-gray-700 text-[9px]">Utilidad</th>
                                <th className="px-1.5 py-1.5 text-center font-semibold text-gray-700 text-[9px]">Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {shipments.map((shipment, index) => (
                                <Fragment key={shipment.id}>
                                    <ShipmentTableRow
                                        shipment={shipment}
                                        index={index}
                                        onViewDetails={handleToggleInline}
                                        isExpanded={expandedRowId === shipment.id}
                                    />
                                    {expandedRowId === shipment.id && (
                                        <tr>
                                            <td colSpan={7} className="bg-slate-50 border-t">
                                                <ShipmentInlineDetails
                                                    shipment={shipment}
                                                    onViewFullDetails={handleOpenFullDetails}
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default MultipleLiquidationSummary;
