
import { useState, useMemo, useCallback, Fragment, useEffect, memo } from 'preact/compat';
import Icon from './icons/Icon';
import Card from './Card';
import ConsolidatedTotals from './ConsolidatedTotals';
import ShipmentTableRowBase from './ShipmentTableRow';
import ShipmentInlineDetails from './ShipmentInlineDetails';
import InfoGrid from './InfoGrid';
import FinancialSummary from './FinancialSummary';
import FinancialDetails from './FinancialDetails';
import RulesSummary from './RulesSummary';
import { mergeCompraVentaItems } from '../hooks/useFinancials';
import type { ShipmentSummary, ConsolidatedTotals as ConsolidatedTotalsType, ViewMode, FinancialItem, TabType, CompraVentaItem, DeductionItem, CommissionItem, BaseValues } from '../types';

// ✅ OPTIMIZACIÓN: Memoizar ShipmentTableRow para evitar re-renders de 30 filas
const ShipmentTableRow = memo(ShipmentTableRowBase, (prev, next) => {
    return (
        prev.shipment.id === next.shipment.id &&
        prev.shipment.utilidad === next.shipment.utilidad &&
        prev.shipment.status === next.shipment.status &&
        prev.index === next.index &&
        prev.isExpanded === next.isExpanded
    );
});

// ✅ OPTIMIZACIÓN: Función pura para calcular baseValues (reutilizable)
const calculateBaseValues = (generalInfo: ShipmentSummary['generalInfo']): BaseValues => ({
    fijo: 1,
    peso_cobrable: Number(generalInfo.pesoCobrable) || 0,
    gross_weight: Number(generalInfo.grossWeight) || 0,
    piezas: Number(generalInfo.piezas) || 0,
    volumen: Number(generalInfo.volumen) || 0,
    freight_charge: Number(generalInfo.freightCharge) || 0,
    due_agent: Number(generalInfo.dueAgent) || 0,
    due_carrier: Number(generalInfo.dueCarrier) || 0,
    hijas: Number(generalInfo.totalHijas) || 0
});

// ✅ OPTIMIZACIÓN: Función pura para calcular utilidad de un shipment
const calculateShipmentUtilidad = (
    items: EditableShipmentData,
    baseValues: BaseValues
): number => {
    const cobros = items.compraVentaItems.reduce((sum, item) => sum + (item.valorVenta * ((baseValues as any)[item.baseKey] ?? 0)), 0);
    const pagos = items.compraVentaItems.reduce((sum, item) => sum + (item.valorCompra * ((baseValues as any)[item.baseKey] ?? 0)), 0);
    const deducciones = items.deductionItems.reduce((sum, item) => sum + (item.valor * ((baseValues as any)[item.baseKey] ?? 0)), 0);
    const comisiones = items.commissionItems.reduce((sum, item) => sum + (item.valor * ((baseValues as any)[item.baseKey] ?? 0)), 0);
    return cobros - pagos - deducciones - comisiones;
};

interface MultipleLiquidationSummaryProps {
    shipments: ShipmentSummary[];
    onViewModeChange?: (mode: ViewMode) => void;
    onShipmentsEdited?: (editedData: Record<string, EditableShipmentData>) => void;
}

// Tipo para el estado editable de cada shipment
export type EditableShipmentData = {
    compraVentaItems: CompraVentaItem[];
    deductionItems: DeductionItem[];
    commissionItems: CommissionItem[];
};

const MultipleLiquidationSummary = ({ shipments, onViewModeChange, onShipmentsEdited }: MultipleLiquidationSummaryProps) => {
    const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
    const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
    const [detailViewMode, setDetailViewMode] = useState<'liquidacion' | 'politicas'>('liquidacion');
    
    // ✅ Estado editable para los items de cada shipment (key = shipment.id)
    const [editedShipments, setEditedShipments] = useState<Record<string, EditableShipmentData>>({});

    // ✅ Notificar al padre cuando cambien los datos editados
    useEffect(() => {
        if (onShipmentsEdited) {
            onShipmentsEdited(editedShipments);
        }
    }, [editedShipments, onShipmentsEdited]);

    // ✅ Función para obtener los items actuales de un shipment (editados o originales)
    const getShipmentItems = useCallback((shipment: ShipmentSummary): EditableShipmentData => {
        if (editedShipments[shipment.id]) {
            return editedShipments[shipment.id];
        }
        return {
            compraVentaItems: mergeCompraVentaItems(shipment.compraVentaItems),
            deductionItems: shipment.deductionItems,
            commissionItems: shipment.commissionItems
        };
    }, [editedShipments]);

    // ✅ Función para añadir un item a un shipment específico
    const handleAddItem = useCallback((shipmentId: string, item: FinancialItem) => {
        console.log('📥 handleAddItem called:', shipmentId, item);
        setEditedShipments(prev => {
            const shipment = shipments.find(s => s.id === shipmentId);
            if (!shipment) return prev;
            
            const currentData = prev[shipmentId] || {
                compraVentaItems: mergeCompraVentaItems(shipment.compraVentaItems),
                deductionItems: [...shipment.deductionItems],
                commissionItems: [...shipment.commissionItems]
            };
            
            if (item.type === 'compraVenta') {
                const newItem = item as CompraVentaItem;
                // Verificar si ya existe para fusionar
                const existingIndex = currentData.compraVentaItems.findIndex(
                    existing => existing.rubro.toLowerCase() === newItem.rubro.toLowerCase() && 
                               existing.baseKey === newItem.baseKey
                );
                
                if (existingIndex !== -1) {
                    // Fusionar con existente
                    const existing = currentData.compraVentaItems[existingIndex];
                    const mergedItem: CompraVentaItem = {
                        ...existing,
                        valorCompra: newItem.valorCompra > 0 ? newItem.valorCompra : existing.valorCompra,
                        valorVenta: newItem.valorVenta > 0 ? newItem.valorVenta : existing.valorVenta,
                        chargeId: newItem.chargeId || existing.chargeId,
                        iataCode: newItem.iataCode || existing.iataCode,
                    };
                    const updatedItems = [...currentData.compraVentaItems];
                    updatedItems[existingIndex] = mergedItem;
                    return {
                        ...prev,
                        [shipmentId]: { ...currentData, compraVentaItems: updatedItems }
                    };
                }
                
                // Añadir como nuevo
                return {
                    ...prev,
                    [shipmentId]: {
                        ...currentData,
                        compraVentaItems: [...currentData.compraVentaItems, newItem]
                    }
                };
            } else if (item.type === 'deductions') {
                return {
                    ...prev,
                    [shipmentId]: {
                        ...currentData,
                        deductionItems: [...currentData.deductionItems, item as DeductionItem]
                    }
                };
            } else {
                return {
                    ...prev,
                    [shipmentId]: {
                        ...currentData,
                        commissionItems: [...currentData.commissionItems, item as CommissionItem]
                    }
                };
            }
        });
    }, [shipments]);

    // ✅ Función para eliminar un item de un shipment específico
    const handleDeleteItem = useCallback((shipmentId: string, itemId: string, type: TabType) => {
        console.log('🗑️ handleDeleteItem called:', shipmentId, itemId, type);
        setEditedShipments(prev => {
            const shipment = shipments.find(s => s.id === shipmentId);
            if (!shipment) return prev;
            
            const currentData = prev[shipmentId] || {
                compraVentaItems: mergeCompraVentaItems(shipment.compraVentaItems),
                deductionItems: [...shipment.deductionItems],
                commissionItems: [...shipment.commissionItems]
            };
            
            if (type === 'compraVenta') {
                return {
                    ...prev,
                    [shipmentId]: {
                        ...currentData,
                        compraVentaItems: currentData.compraVentaItems.filter(i => i.id !== itemId)
                    }
                };
            } else if (type === 'deductions') {
                return {
                    ...prev,
                    [shipmentId]: {
                        ...currentData,
                        deductionItems: currentData.deductionItems.filter(i => i.id !== itemId)
                    }
                };
            } else {
                return {
                    ...prev,
                    [shipmentId]: {
                        ...currentData,
                        commissionItems: currentData.commissionItems.filter(i => i.id !== itemId)
                    }
                };
            }
        });
    }, [shipments]);

    // ✅ OPTIMIZACIÓN: Calcular totales consolidados incluyendo ediciones
    const consolidatedTotals = useMemo<ConsolidatedTotalsType>(() => {
        const totals = shipments.reduce((acc, ship) => {
            acc.totalShipments++;
            
            // Obtener items actuales (editados o originales)
            const currentItems = editedShipments[ship.id] || {
                compraVentaItems: ship.compraVentaItems,
                deductionItems: ship.deductionItems,
                commissionItems: ship.commissionItems
            };
            
            // Usar función pura reutilizable
            const baseValues = calculateBaseValues(ship.generalInfo);
            const shipUtilidad = calculateShipmentUtilidad(currentItems, baseValues);
            
            // Calcular cobros/pagos para totales consolidados
            const shipCobros = currentItems.compraVentaItems.reduce((sum, item) => sum + (item.valorVenta * (baseValues[item.baseKey] ?? 0)), 0);
            const shipPagos = currentItems.compraVentaItems.reduce((sum, item) => sum + (item.valorCompra * (baseValues[item.baseKey] ?? 0)), 0);
            
            acc.totalCobros += shipCobros;
            acc.totalPagos += shipPagos;
            acc.totalUtilidad += shipUtilidad;
            
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
    }, [shipments, editedShipments]);

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
        const baseValues = calculateBaseValues(selectedShipment.generalInfo);

        // ✅ Obtener items editados (o originales si no hay ediciones)
        const currentItems = getShipmentItems(selectedShipment);

        // ✅ Recalcular totales basados en los items actuales (editados o no)
        const totals = {
            totalCobros: currentItems.compraVentaItems.reduce((sum, item) => sum + (item.valorVenta * (baseValues[item.baseKey] ?? 0)), 0),
            totalPagos: currentItems.compraVentaItems.reduce((sum, item) => sum + (item.valorCompra * (baseValues[item.baseKey] ?? 0)), 0),
            totalDeducciones: currentItems.deductionItems.reduce((sum, item) => sum + (item.valor * (baseValues[item.baseKey] ?? 0)), 0),
            totalComisiones: currentItems.commissionItems.reduce((sum, item) => sum + (item.valor * (baseValues[item.baseKey] ?? 0)), 0),
            utilidad: 0,
            utilidadPorc: 0
        };
        totals.utilidad = totals.totalCobros - totals.totalPagos - totals.totalDeducciones - totals.totalComisiones;
        const totalCostos = totals.totalPagos + totals.totalDeducciones + totals.totalComisiones;
        totals.utilidadPorc = totalCostos > 0 ? (totals.utilidad / totalCostos) * 100 : (totals.totalCobros > 0 ? 100 : 0);

        return (
            <div className="space-y-1.5">
                {/* Navigation Bar */}
                <Card title="" icon="empty">
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
                                        compraVenta: currentItems.compraVentaItems,
                                        deductions: currentItems.deductionItems,
                                        commissions: currentItems.commissionItems
                                    }}
                                    actions={{
                                        addItem: (item: FinancialItem) => handleAddItem(selectedShipment.id, item),
                                        deleteItem: (id: string, type: TabType) => handleDeleteItem(selectedShipment.id, id, type)
                                    }}
                                    baseValues={baseValues}
                                />
                            </>
                        ) : (
                            <RulesSummary 
                                rule={selectedShipment.policyRule} 
                                compraVentaItems={currentItems.compraVentaItems}
                            />
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ✅ OPTIMIZACIÓN: Memoizar shipments enriquecidos con utilidades calculadas
    // Esto evita recalcular en cada render del map
    const enrichedShipments = useMemo(() => {
        return shipments.map(shipment => {
            // Solo recalcular si hay ediciones para este shipment
            if (!editedShipments[shipment.id]) {
                return shipment; // Sin cambios, retornar original
            }
            
            const currentItems = editedShipments[shipment.id];
            const baseValues = calculateBaseValues(shipment.generalInfo);
            const utilidad = calculateShipmentUtilidad(currentItems, baseValues);
            
            return { ...shipment, utilidad };
        });
    }, [shipments, editedShipments]);

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
                            {/* ✅ OPTIMIZACIÓN: Usar enrichedShipments ya memoizado */}
                            {enrichedShipments.map((shipment, index) => (
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
