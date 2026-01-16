
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

// Función para normalizar nombre de rubro para matching (ignora mayúsculas, espacios extra, caracteres especiales)
const normalizeRubroName = (name: string): string => {
    return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ')           // Colapsar espacios múltiples
        .replace(/[^a-z0-9\s]/g, '');   // Remover caracteres especiales
};

// Genera clave solo por nombre normalizado (para detectar duplicados)
const getNameKey = (rubro: string): string => {
    return normalizeRubroName(rubro);
};

// ✅ NUEVA: Función para fusionar rubros y detectar conflictos de baseKey
// - Si mismo nombre + mismo baseKey → FUSIONAR en una línea
// - Si mismo nombre + DIFERENTE baseKey → MANTENER SEPARADOS y marcar como conflicto
// ✅ EXPORTADA para uso en modo múltiple
export const mergeCompraVentaItems = (items: CompraVentaItem[]): CompraVentaItem[] => {
    const merged: CompraVentaItem[] = [];
    // Mapa: nombreNormalizado -> { baseKey, index en merged }
    const rubroMap = new Map<string, { baseKey: string; index: number }>();
    
    for (const item of items) {
        const nameKey = getNameKey(item.rubro);
        const existing = rubroMap.get(nameKey);
        
        if (existing !== undefined) {
            // Ya existe un item con el mismo nombre
            if (existing.baseKey === item.baseKey) {
                // ✅ MISMO nombre + MISMO baseKey → FUSIONAR
                const existingItem = merged[existing.index];
                merged[existing.index] = {
                    ...existingItem,
                    valorCompra: item.valorCompra > 0 ? item.valorCompra : existingItem.valorCompra,
                    valorVenta: item.valorVenta > 0 ? item.valorVenta : existingItem.valorVenta,
                    chargeId: item.chargeId || existingItem.chargeId,
                    iataCode: item.iataCode || existingItem.iataCode,
                    hasConflict: false, // Confirmar que no hay conflicto
                };
            } else {
                // ⚠️ MISMO nombre + DIFERENTE baseKey → CONFLICTO
                // Marcar el item existente como conflicto si no lo está ya
                const existingItem = merged[existing.index];
                const conflictMsg = `Base diferente: Este usa "${existingItem.baseKey}", otro usa "${item.baseKey}"`;
                merged[existing.index] = {
                    ...existingItem,
                    hasConflict: true,
                    conflictReason: conflictMsg,
                };
                
                // Agregar el nuevo item también marcado como conflicto
                merged.push({
                    ...item,
                    hasConflict: true,
                    conflictReason: `Base diferente: Este usa "${item.baseKey}", otro usa "${existingItem.baseKey}"`,
                });
            }
        } else {
            // Nuevo rubro, agregar al mapa y al array
            rubroMap.set(nameKey, { baseKey: item.baseKey, index: merged.length });
            merged.push({ ...item, hasConflict: false });
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
                const newNameKey = getNameKey(newItem.rubro);
                console.log('🔍 Looking for name key:', newNameKey);
                
                // Buscar si ya existe un rubro con el mismo nombre (sin importar baseKey)
                const existingIndex = state.compraVenta.findIndex(
                    existing => getNameKey(existing.rubro) === newNameKey
                );
                
                console.log('🔍 Existing index:', existingIndex, 'Current items:', state.compraVenta.length);
                
                if (existingIndex !== -1) {
                    const existing = state.compraVenta[existingIndex];
                    
                    if (existing.baseKey === newItem.baseKey) {
                        // ✅ MISMO nombre + MISMO baseKey → FUSIONAR
                        console.log('🔄 MERGING with existing item (same baseKey)');
                        const mergedItem: CompraVentaItem = {
                            ...existing,
                            valorCompra: newItem.valorCompra > 0 ? newItem.valorCompra : existing.valorCompra,
                            valorVenta: newItem.valorVenta > 0 ? newItem.valorVenta : existing.valorVenta,
                            chargeId: newItem.chargeId || existing.chargeId,
                            iataCode: newItem.iataCode || existing.iataCode,
                            hasConflict: false,
                        };
                        
                        const updatedCompraVenta = [...state.compraVenta];
                        updatedCompraVenta[existingIndex] = mergedItem;
                        return { ...state, compraVenta: updatedCompraVenta };
                    } else {
                        // ⚠️ MISMO nombre + DIFERENTE baseKey → CONFLICTO
                        console.log('⚠️ CONFLICT: Same name but different baseKey');
                        const conflictMsgExisting = `Base diferente: Este usa "${existing.baseKey}", otro usa "${newItem.baseKey}"`;
                        const conflictMsgNew = `Base diferente: Este usa "${newItem.baseKey}", otro usa "${existing.baseKey}"`;
                        
                        const updatedCompraVenta = [...state.compraVenta];
                        updatedCompraVenta[existingIndex] = {
                            ...existing,
                            hasConflict: true,
                            conflictReason: conflictMsgExisting,
                        };
                        
                        return {
                            ...state,
                            compraVenta: [...updatedCompraVenta, {
                                ...newItem,
                                hasConflict: true,
                                conflictReason: conflictMsgNew,
                            }]
                        };
                    }
                }
                
                // No hay match por nombre, agregar como nuevo
                console.log('✅ ADDING as new item');
                return { ...state, compraVenta: [...state.compraVenta, { ...newItem, hasConflict: false }] };
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
    // ✅ APLICAR MERGE al estado inicial para fusionar rubros duplicados
    const [financialState, dispatch] = useReducer(financialReducer, {
        compraVenta: mergeCompraVentaItems(initialCompraVenta),
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
