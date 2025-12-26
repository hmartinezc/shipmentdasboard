import type { GeneralInfo, CompraVentaItem, DeductionItem, CommissionItem, ExporterOption, RubroOption } from '../types';
import { mockGeneralInfo, mockCompraVentaItems, mockDeductionItems, mockCommissionItems, DEMO_CONFIG } from '../data/mockData';

/**
 * Servicio de API para comunicación con el backend
 * Por ahora usa datos mock, pero está preparado para integración real
 */

// Simular delay de red
const simulateNetworkDelay = () => 
    new Promise(resolve => setTimeout(resolve, DEMO_CONFIG.apiDelay));

/**
 * API Service - Métodos para comunicación con backend
 */
export const apiService = {
    /**
     * Obtiene la información general del envío
     */
    async getGeneralInfo(awbNumber?: string): Promise<GeneralInfo> {
        await simulateNetworkDelay();
        
        if (DEMO_CONFIG.useMockData) {
            // Retornar datos mock
            return { ...mockGeneralInfo };
        }
        
        // TODO: Implementar llamada real al backend
        // const response = await fetch(`/api/shipments/${awbNumber}/info`);
        // return await response.json();
        
        return { ...mockGeneralInfo };
    },

    /**
     * Actualiza la información general
     */
    async updateGeneralInfo(info: GeneralInfo): Promise<{ success: boolean; message: string }> {
        await simulateNetworkDelay();
        
        if (DEMO_CONFIG.useMockData) {
            console.log('📝 Actualizando información general (MOCK):', info);
            return { success: true, message: 'Información actualizada correctamente' };
        }
        
        // TODO: Implementar llamada real al backend
        // const response = await fetch('/api/shipments/info', {
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(info)
        // });
        // return await response.json();
        
        return { success: true, message: 'Información actualizada correctamente' };
    },

    /**
     * Obtiene los items de compra/venta
     */
    async getCompraVentaItems(awbNumber?: string): Promise<CompraVentaItem[]> {
        await simulateNetworkDelay();
        
        if (DEMO_CONFIG.useMockData) {
            return [...mockCompraVentaItems];
        }
        
        // TODO: Implementar llamada real
        // const response = await fetch(`/api/shipments/${awbNumber}/items/compra-venta`);
        // return await response.json();
        
        return [];
    },

    /**
     * Obtiene los items de deducciones
     */
    async getDeductionItems(awbNumber?: string): Promise<DeductionItem[]> {
        await simulateNetworkDelay();
        
        if (DEMO_CONFIG.useMockData) {
            return [...mockDeductionItems];
        }
        
        // TODO: Implementar llamada real
        return [];
    },

    /**
     * Obtiene los items de comisiones
     */
    async getCommissionItems(awbNumber?: string): Promise<CommissionItem[]> {
        await simulateNetworkDelay();
        
        if (DEMO_CONFIG.useMockData) {
            return [...mockCommissionItems];
        }
        
        // TODO: Implementar llamada real
        return [];
    },

    /**
     * Agrega un nuevo item (compra/venta, deducción o comisión)
     */
    async addItem(item: CompraVentaItem | DeductionItem | CommissionItem): Promise<{ success: boolean; message: string }> {
        await simulateNetworkDelay();
        
        if (DEMO_CONFIG.useMockData) {
            console.log('➕ Agregando item (MOCK):', item);
            return { success: true, message: 'Item agregado correctamente' };
        }
        
        // TODO: Implementar llamada real
        // const response = await fetch('/api/shipments/items', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(item)
        // });
        // return await response.json();
        
        return { success: true, message: 'Item agregado correctamente' };
    },

    /**
     * Elimina un item
     */
    async deleteItem(itemId: string, type: string): Promise<{ success: boolean; message: string }> {
        await simulateNetworkDelay();
        
        if (DEMO_CONFIG.useMockData) {
            console.log('🗑️ Eliminando item (MOCK):', { itemId, type });
            return { success: true, message: 'Item eliminado correctamente' };
        }
        
        // TODO: Implementar llamada real
        // const response = await fetch(`/api/shipments/items/${itemId}`, {
        //     method: 'DELETE'
        // });
        // return await response.json();
        
        return { success: true, message: 'Item eliminado correctamente' };
    },

    /**
     * Obtiene las opciones de exportadores desde el backend
     */
    async getExporterOptions(): Promise<ExporterOption[]> {
        await simulateNetworkDelay();
        
        if (DEMO_CONFIG.useMockData) {
            return [
                { value: 'ODFISH', text: 'ODFISH-ODFISH EXPORT S.A.S.' },
                { value: 'PRODUMAR', text: 'PRODUMAR S.A.' },
                { value: 'EXPORKLIP', text: 'EXPORKLIP S.A.' },
                { value: 'OCEANFISH', text: 'OCEANFISH S.A.' },
                { value: 'SEACORP', text: 'SEACORP INTERNATIONAL' }
            ];
        }
        
        // TODO: Implementar llamada real
        // const response = await fetch('/api/config/exporters');
        // return await response.json();
        
        return [];
    },

    /**
     * Obtiene las opciones de rubros dinámicamente desde el backend
     */
    async getRubroOptions(type: 'compraVenta' | 'deductions' | 'commissions'): Promise<RubroOption[]> {
        await simulateNetworkDelay();
        
        if (DEMO_CONFIG.useMockData) {
            // Retornar opciones según el tipo
            const mockOptions: Record<string, RubroOption[]> = {
                compraVenta: [
                    { value: 'Air Freight', text: 'Air Freight', type: 'both', chargeId: 'CHG-001', iataCode: 'AF' },
                    { value: 'Fuel Surcharge', text: 'Fuel Surcharge', type: 'both', chargeId: 'CHG-002', iataCode: 'FS' },
                    { value: 'Handling', text: 'Handling', type: 'both', chargeId: 'CHG-003', iataCode: 'HD' },
                    { value: 'Insurance', text: 'Insurance', type: 'both', chargeId: 'CHG-004', iataCode: 'IN' },
                    { value: 'Security Fee', text: 'Security Fee (Carrier)', type: 'compra', chargeId: 'CHG-005', iataCode: 'SF' },
                    { value: 'AWB Fee', text: 'AWB Fee', type: 'venta', chargeId: 'CHG-006', iataCode: 'AW' },
                    { value: 'Screening', text: 'Screening', type: 'venta', chargeId: 'CHG-007', iataCode: 'SC' },
                    { value: 'IT/Customs', text: 'IT / Customs', type: 'compra', chargeId: 'CHG-008', iataCode: 'IT' },
                ],
                deductions: [
                    { value: 'Descuento por pronto pago', text: 'Descuento por pronto pago', chargeId: 'DED-001', iataCode: 'DPP' },
                    { value: 'Nota de crédito aplicada', text: 'Nota de crédito aplicada', chargeId: 'DED-002', iataCode: 'NCA' },
                    { value: 'Ajuste por peso', text: 'Ajuste por peso', chargeId: 'DED-003', iataCode: 'APE' },
                    { value: 'Reclamo por daño', text: 'Reclamo por daño', chargeId: 'DED-004', iataCode: 'RDA' },
                ],
                commissions: [
                    { value: 'Comisión Agente Origen', text: 'Comisión Agente Origen', chargeId: 'COM-001', iataCode: 'CAO' },
                    { value: 'Comisión Agente Destino', text: 'Comisión Agente Destino', chargeId: 'COM-002', iataCode: 'CAD' },
                    { value: 'Comisión Vendedor', text: 'Comisión Vendedor', chargeId: 'COM-003', iataCode: 'CVE' },
                ]
            };
            
            return mockOptions[type] || [];
        }
        
        // TODO: Implementar llamada real
        // const response = await fetch(`/api/config/rubros/${type}`);
        // return await response.json();
        
        return [];
    },

    /**
     * Guarda todos los datos del envío (para enviar al backend)
     */
    async saveShipment(data: {
        generalInfo: GeneralInfo;
        compraVentaItems: CompraVentaItem[];
        deductionItems: DeductionItem[];
        commissionItems: CommissionItem[];
    }): Promise<{ success: boolean; message: string }> {
        await simulateNetworkDelay();
        
        if (DEMO_CONFIG.useMockData) {
            console.log('💾 Guardando envío completo (MOCK):', data);
            return { success: true, message: 'Envío guardado correctamente' };
        }
        
        // TODO: Implementar llamada real
        // const response = await fetch('/api/shipments/save', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(data)
        // });
        // return await response.json();
        
        return { success: true, message: 'Envío guardado correctamente' };
    }
};
