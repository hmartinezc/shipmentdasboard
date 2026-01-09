
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

// Función para normalizar nombre de rubro para matching (ignora mayúsculas, espacios extra, etc.)
const normalizeRubroName = (name: string): string => {
    return name.toLowerCase().trim().replace(/\s+/g, ' ');
};

// Genera una clave única para matching: nombre + baseKey (solo fusiona si ambos coinciden)
const getMatchKey = (rubro: string, baseKey: string): string => {
    return `${normalizeRubroName(rubro)}|${baseKey}`;
};

// Función para fusionar rubros duplicados en un array de CompraVentaItems
// Solo fusiona si tienen el mismo nombre Y la misma base de cálculo
// ✅ EXPORTADA para uso en modo múltiple
export const mergeCompraVentaItems = (items: CompraVentaItem[]): CompraVentaItem[] => {
    const merged: CompraVentaItem[] = [];
    const rubroMap = new Map<string, number>(); // matchKey -> index en merged
    
    for (const item of items) {
        const matchKey = getMatchKey(item.rubro, item.baseKey);
        const existingIndex = rubroMap.get(matchKey);
        
        if (existingIndex !== undefined) {
            // Match encontrado (mismo nombre + misma baseKey): fusionar valores
            const existing = merged[existingIndex];
            merged[existingIndex] = {
                ...existing,
                valorCompra: item.valorCompra > 0 ? item.valorCompra : existing.valorCompra,
                valorVenta: item.valorVenta > 0 ? item.valorVenta : existing.valorVenta,
                chargeId: item.chargeId || existing.chargeId,
                iataCode: item.iataCode || existing.iataCode,
            };
        } else {
            // Nuevo rubro o diferente baseKey
            rubroMap.set(matchKey, merged.length);
            merged.push({ ...item });
        }
    }
    
    return merged;
};

const financialReducer = (state: FinancialState, action: FinancialAction): FinancialState => {
    console.log('🔄 financialReducer called:', action.type, action);
    switch (action.type) {
        case 'SET_ALL':
            // Aplicar matching automático al cargar datos
            return {
                ...action.payload,
                compraVenta: mergeCompraVentaItems(action.payload.compraVenta)
            };
        case 'ADD_ITEM':
            const { item } = action;
            console.log('➕ ADD_ITEM:', item);
            if (item.type === 'compraVenta') {
                const newItem = item as CompraVentaItem;
                const newMatchKey = getMatchKey(newItem.rubro, newItem.baseKey);
                console.log('🔍 Looking for match key:', newMatchKey);
                
                // Buscar si ya existe un rubro con el mismo nombre Y misma baseKey
                const existingIndex = state.compraVenta.findIndex(
                    existing => getMatchKey(existing.rubro, existing.baseKey) === newMatchKey
                );
                
                console.log('🔍 Existing index:', existingIndex, 'Current items:', state.compraVenta.length);
                
                if (existingIndex !== -1) {
                    // ✅ MATCH ENCONTRADO: Fusionar valores (mismo nombre + misma baseKey)
                    console.log('🔄 MERGING with existing item');
                    const existing = state.compraVenta[existingIndex];
                    const mergedItem: CompraVentaItem = {
                        ...existing,
                        // Si el nuevo trae valorCompra > 0, usar el nuevo (actualiza)
                        valorCompra: newItem.valorCompra > 0 ? newItem.valorCompra : existing.valorCompra,
                        // Si el nuevo trae valorVenta > 0, usar el nuevo (actualiza)
                        valorVenta: newItem.valorVenta > 0 ? newItem.valorVenta : existing.valorVenta,
                        // Preservar chargeId e iataCode si existen
                        chargeId: newItem.chargeId || existing.chargeId,
                        iataCode: newItem.iataCode || existing.iataCode,
                    };
                    
                    const updatedCompraVenta = [...state.compraVenta];
                    updatedCompraVenta[existingIndex] = mergedItem;
                    return { ...state, compraVenta: updatedCompraVenta };
                }
                
                // No hay match (diferente nombre o diferente baseKey), agregar como nuevo
                console.log('✅ ADDING as new item');
                return { ...state, compraVenta: [...state.compraVenta, newItem] };
            } else if (item.type === 'deductions') {
                console.log('✅ ADDING deduction');
                return { ...state, deductions: [...state.deductions, item] };
            } else {
                console.log('✅ ADDING commission');
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
        console.log('📥 addItem called in useFinancials:', item);
        // Primero agregar localmente para UI responsiva
        dispatch({ type: 'ADD_ITEM', item });
        console.log('📤 dispatch sent');
        
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
        hijas: Number(generalInfo.totalHijas) || 0,
    }), [generalInfo.pesoCobrable, generalInfo.grossWeight, generalInfo.piezas, generalInfo.volumen, generalInfo.freightCharge, generalInfo.dueAgent, generalInfo.dueCarrier, generalInfo.totalHijas]);

    // ✅ OPTIMIZACIÓN 4: Cálculos optimizados con reduce memoizado
    const totals = useMemo<Totals>(() => {
        const { compraVenta, deductions, commissions } = financialState;
        const { fijo, peso_cobrable, gross_weight, piezas, volumen, freight_charge, due_agent, due_carrier, hijas } = baseValues;
        
        // Pre-calcular lookup table para mejor performance
        const baseValuesLookup: Record<string, number> = { fijo, peso_cobrable, gross_weight, piezas, volumen, freight_charge, due_agent, due_carrier, hijas };
        
        const totalCobros = compraVenta.reduce((acc, item) => 
            acc + (item.valorVenta * (baseValuesLookup[item.baseKey] ?? 0)), 0);
        
        const totalPagos = compraVenta.reduce((acc, item) => 
            acc + (item.valorCompra * (baseValuesLookup[item.baseKey] ?? 0)), 0);
        
        const totalDeducciones = deductions.reduce((acc, item) => 
            acc + (item.valor * (baseValuesLookup[item.baseKey] ?? 0)), 0);
        
        const totalComisiones = commissions.reduce((acc, item) => 
            acc + (item.valor * (baseValuesLookup[item.baseKey] ?? 0)), 0);
        
        const utilidad = totalCobros - totalPagos - totalDeducciones - totalComisiones;
        const totalCostos = totalPagos + totalDeducciones + totalComisiones;
        const utilidadPorc = totalCostos > 0 ? (utilidad / totalCostos) * 100 : (totalCobros > 0 ? 100 : 0);
        
        return { totalCobros, totalPagos, totalDeducciones, totalComisiones, utilidad, utilidadPorc };
    }, [financialState, baseValues]);

    // Debug: log cuando cambia el estado
    console.log('🔵 useFinancials render - compraVenta items:', financialState.compraVenta.length, financialState.compraVenta.map(i => i.rubro + '|' + i.baseKey));

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
