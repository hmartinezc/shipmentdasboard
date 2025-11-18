
import { useState, useMemo, lazy, Suspense, useCallback } from 'preact/compat';
import Icon from './components/icons/Icon';
import PageHeader from './components/PageHeader';
import InfoGrid from './components/InfoGrid';
import FinancialSummary from './components/FinancialSummary';
import useFinancials from './hooks/useFinancials';
import { mockPolicyRule, mockMultipleShipments } from './data/mockData';
import type { ViewMode, ShipmentSummary, ExporterOption, RubroOption } from './types';

// ✅ OPTIMIZACIÓN: Lazy load de componentes pesados
const FinancialDetails = lazy(() => import('./components/FinancialDetails'));
const RulesSummary = lazy(() => import('./components/RulesSummary'));
const MultipleLiquidationSummary = lazy(() => import('./components/MultipleLiquidationSummary'));

// Props interface for modal integration
export interface AppProps {
    shipmentsData?: ShipmentSummary[];
    mode?: 'single' | 'multiple';
    exporterOptions?: ExporterOption[];
    rubroOptions?: {
        compraVenta: RubroOption[];
        deductions: RubroOption[];
        commissions: RubroOption[];
    };
    onSave?: () => void;
    onCancel?: () => void;
    isModal?: boolean; // Si es true, no renderiza background ni padding exterior
}

// ✅ OPTIMIZACIÓN: Loading component inline
const ComponentLoader = () => (
    <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
    </div>
);

const App = ({ 
    shipmentsData, 
    mode = 'multiple',
    exporterOptions,
    rubroOptions,
    onSave,
    onCancel,
    isModal = false
}) => {
    const initialShipment = mode === 'single' ? shipmentsData?.[0] : undefined;
    const financials = useFinancials(initialShipment ? {
        generalInfo: initialShipment.generalInfo,
        compraVentaItems: initialShipment.compraVentaItems,
        deductionItems: initialShipment.deductionItems,
        commissionItems: initialShipment.commissionItems,
        disableAutoLoad: true
    } : undefined);
    const [viewMode, setViewMode] = useState<ViewMode>(mode === 'single' ? 'liquidacion' : 'resumen');

    const isMultipleMode = useMemo(() => mode === 'multiple', [mode]);

    // ✅ OPTIMIZACIÓN: useCallback para handlers
    const handleViewModeChange = useCallback((newMode: ViewMode) => {
        setViewMode(newMode);
    }, []);

    if (financials.isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
                    <p className="mt-4 text-gray-600 font-medium">Cargando datos...</p>
                </div>
            </div>
        );
    }

    // Single Mode (1 shipment)
    if (!isMultipleMode) {
        return (
            <div className={isModal ? "text-gray-800 font-['Inter',_'Segoe_UI',_system-ui,_sans-serif] text-[11px]" : "bg-gradient-to-br from-slate-50 to-slate-100 text-gray-800 font-['Inter',_'Segoe_UI',_system-ui,_sans-serif] text-[11px] p-1.5 min-h-screen"}>
                <main className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[32%_1fr] gap-1.5">
                    <PageHeader 
                        viewMode={viewMode} 
                        onViewModeChange={handleViewModeChange}
                        onCancel={onCancel}
                        onSave={onSave}
                    />

                    <div className="flex flex-col gap-1.5">
                        <InfoGrid
                            generalInfo={financials.generalInfo}
                            updateGeneralInfo={financials.updateGeneralInfo}
                            totals={financials.totals}
                            exporterOptions={exporterOptions}
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Suspense fallback={<ComponentLoader />}>
                            {viewMode === 'liquidacion' ? (
                                <>
                                    <FinancialSummary totals={financials.totals} />
                                    <FinancialDetails
                                        items={{
                                            compraVenta: financials.compraVentaItems,
                                            deductions: financials.deductionItems,
                                            commissions: financials.commissionItems
                                        }}
                                        actions={{
                                            addItem: financials.addItem,
                                            deleteItem: financials.deleteItem
                                        }}
                                        baseValues={financials.baseValues}
                                        rubroOptions={rubroOptions}
                                    />
                                </>
                            ) : (
                                <RulesSummary rule={shipmentsData?.[0]?.policyRule || mockPolicyRule} />
                            )}
                        </Suspense>
                    </div>

                </main>
            </div>
        );
    }

    // Multiple Mode (Multiple shipments)
    const effectiveShipments = shipmentsData ?? mockMultipleShipments;
    return (
        <div className={isModal ? "text-gray-800 font-['Inter',_'Segoe_UI',_system-ui,_sans-serif] text-[11px]" : "bg-gradient-to-br from-slate-50 to-slate-100 text-gray-800 font-['Inter',_'Segoe_UI',_system-ui,_sans-serif] text-[11px] p-1.5 min-h-screen"}>
            <main className="max-w-[1400px] mx-auto">
                <div className="mb-1.5">
                    <header className="flex flex-col sm:flex-row justify-between items-center px-2.5 py-1.5 bg-[#7034d5] rounded-lg shadow-lg text-white">
                        <h1 className="text-xs font-bold flex items-center gap-1.5 m-0">
                            <div className="bg-white/20 backdrop-blur-sm w-7 h-7 rounded-lg flex items-center justify-center shadow-md">
                                <Icon name="boxesStacked" className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] text-purple-100 font-normal">Liquidación Múltiple</span>
                                <span className="font-mono text-xs text-white">{effectiveShipments.length} Guías Seleccionadas</span>
                            </div>
                        </h1>
                        
                        {viewMode === 'resumen' && (
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={onCancel}
                                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white border border-white/30 px-3 py-1.5 rounded-md cursor-pointer font-semibold text-[10px] flex items-center gap-1.5 transition-all"
                                >
                                    <Icon name="times" className="w-3 h-3" />
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={onSave}
                                    className="bg-cyan-500 hover:bg-cyan-400 text-white border-none px-3 py-1.5 rounded-md cursor-pointer font-bold text-[10px] flex items-center gap-1.5 transition-all shadow-sm hover:shadow"
                                >
                                    <Icon name="checkCircle" className="w-3 h-3" />
                                    Procesar
                                </button>
                            </div>
                        )}
                    </header>
                </div>

                <Suspense fallback={<ComponentLoader />}>
                    <MultipleLiquidationSummary 
                        shipments={effectiveShipments} 
                        onViewModeChange={handleViewModeChange}
                    />
                </Suspense>
            </main>
        </div>
    );
};

export default App;
