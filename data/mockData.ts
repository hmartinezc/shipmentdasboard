import type { GeneralInfo, CompraVentaItem, DeductionItem, CommissionItem } from '../types';

/**
 * Mock data para pruebas y desarrollo
 * Este archivo contiene datos de ejemplo que simularán las respuestas del backend
 */

export const mockGeneralInfo: GeneralInfo = {
    fechaVuelo: '2025-11-14',
    importadorAWB: '230-6584-1226',
    ruta: 'GYE/PTY/MIA',
    piezas: 15,
    grossWeight: 750.00,
    volumen: 95000.50,
    pesoCobrable: 950,
    tipoCorte: 'P (Prepaid)',
    tipoRate: 'Normal',
    tarifaCompra: 0.85,
    tarifaVenta: 1.05,
    rangoPeso: '100kg-9000kg',
    exporter: 'ODFISH',
    freightCharge: 285.50,
    dueAgent: 350.00,
    dueCarrier: 28.00
};

export const mockCompraVentaItems: CompraVentaItem[] = [
    {
        id: 'cv-demo-1',
        type: 'compraVenta',
        rubro: 'Air Freight',
        rubroValue: 'Air Freight',
        rubroType: 'both',
        baseKey: 'peso_cobrable',
        valorCompra: 0.85,
        valorVenta: 1.05,
        chargeId: 'CHG-001',
        iataCode: 'AF'
    },
    {
        id: 'cv-demo-2',
        type: 'compraVenta',
        rubro: 'Fuel Surcharge',
        rubroValue: 'Fuel Surcharge',
        rubroType: 'both',
        baseKey: 'peso_cobrable',
        valorCompra: 0.15,
        valorVenta: 0.20,
        chargeId: 'CHG-002',
        iataCode: 'FS'
    },
    {
        id: 'cv-demo-3',
        type: 'compraVenta',
        rubro: 'Handling',
        rubroValue: 'Handling',
        rubroType: 'both',
        baseKey: 'fijo',
        valorCompra: 45.00,
        valorVenta: 65.00,
        chargeId: 'CHG-003',
        iataCode: 'HD'
    },
    {
        id: 'cv-demo-4',
        type: 'compraVenta',
        rubro: 'Security Fee (Carrier)',
        rubroValue: 'Security Fee',
        rubroType: 'compra',
        baseKey: 'fijo',
        valorCompra: 25.00,
        valorVenta: 0,
        chargeId: 'CHG-005',
        iataCode: 'SF'
    },
    {
        id: 'cv-demo-5',
        type: 'compraVenta',
        rubro: 'Screening',
        rubroValue: 'Screening',
        rubroType: 'venta',
        baseKey: 'fijo',
        valorCompra: 0,
        valorVenta: 35.00,
        chargeId: 'CHG-007',
        iataCode: 'SC'
    }
];

export const mockDeductionItems: DeductionItem[] = [
    {
        id: 'ded-demo-1',
        type: 'deductions',
        rubro: 'Descuento por pronto pago',
        baseKey: 'fijo',
        valor: 50.00,
        extraInfo: 'Pago dentro de 15 días',
        chargeId: 'DED-001',
        iataCode: 'DPP'
    },
    {
        id: 'ded-demo-2',
        type: 'deductions',
        rubro: 'Ajuste por peso',
        baseKey: 'peso_cobrable',
        valor: 0.05,
        extraInfo: 'Recalculo de peso volumétrico',
        chargeId: 'DED-003',
        iataCode: 'APE'
    }
];

export const mockCommissionItems: CommissionItem[] = [
    {
        id: 'com-demo-1',
        type: 'commissions',
        rubro: 'Comisión Agente Origen',
        baseKey: 'fijo',
        valor: 75.00,
        extraInfo: 'Agent GYE',
        chargeId: 'COM-001',
        iataCode: 'CAO'
    },
    {
        id: 'com-demo-2',
        type: 'commissions',
        rubro: 'Comisión Vendedor',
        baseKey: 'peso_cobrable',
        valor: 0.08,
        extraInfo: 'Comisión sobre peso cobrable',
        chargeId: 'COM-003',
        iataCode: 'CVE'
    }
];

/**
 * Mock data para políticas/reglas aplicadas
 */
export const mockPolicyRule: import('../types').PolicyRule = {
    ruleNumber: 'R-2024-0847',
    consignee: 'KUEHNE + NAGEL N.V',
    carrier: 'M6 - BOG LLG AMS',
    ruleType: 'Freight',
    season: 'VALENTINO',
    salesRep: 'Jorge Gamboa',
    daysOfWeek: ['Lu', 'Ma', 'Mi', 'Ju', 'Vi'],
    weightRange: '100.00 kg - 1,050.00 kg',
    ratePerKg: '$2.00',
    items: [
        { name: 'Air Freight', charge: 3.500, payable: 2.000, diff: 1.500 },
        { name: 'Cartage at Origin', charge: 20.000, payable: '-', diff: 20.000 },
        { name: 'Certificados', charge: 20.000, payable: 30.000, diff: -10.000 },
        { name: 'Freight processing fee', charge: 0.250, payable: '-', diff: 0.250 },
        { name: 'Precooling', charge: '-', payable: 0.300, diff: -0.300 }
    ],
    total: {
        charge: 43.750,
        payable: 32.300,
        diff: 11.450
    }
};

/**
 * Configuración de datos demo
 */
export const DEMO_CONFIG = {
    useMockData: true, // Cambiar a false cuando se conecte al backend real
    apiDelay: 500, // Simular delay de red en ms
};

/**
 * Mock data para múltiples guías (modo liquidación múltiple)
 */
export const mockMultipleShipments: import('../types').ShipmentSummary[] = [
    {
        id: 'ship-1',
        awb: '230-6584-1226',
        consignee: 'KUEHNE + NAGEL N.V',
        weight: 950,
        ruleNumber: 'R-2024-0847',
        totalCobros: 1140.00,
        totalPagos: 997.50,
        utilidad: 142.50,
        utilidadPorc: 12.5,
        status: 'valid',
        generalInfo: mockGeneralInfo,
        compraVentaItems: mockCompraVentaItems,
        deductionItems: mockDeductionItems,
        commissionItems: mockCommissionItems,
        policyRule: mockPolicyRule
    },
    {
        id: 'ship-2',
        awb: '230-6585-1227',
        consignee: 'KUEHNE + NAGEL N.V',
        weight: 1200,
        ruleNumber: 'R-2024-0847',
        totalCobros: 1440.00,
        totalPagos: 1200.00,
        utilidad: 240.00,
        utilidadPorc: 16.7,
        status: 'valid',
        generalInfo: { ...mockGeneralInfo, importadorAWB: '230-6585-1227', pesoCobrable: 1200, grossWeight: 950 },
        compraVentaItems: mockCompraVentaItems,
        deductionItems: [],
        commissionItems: mockCommissionItems,
        policyRule: mockPolicyRule
    },
    {
        id: 'ship-3',
        awb: '230-6586-1228',
        consignee: 'DHL GLOBAL FORWARDING',
        weight: 850,
        ruleNumber: 'R-2024-0921',
        totalCobros: 720.00,
        totalPagos: 765.00,
        utilidad: -45.00,
        utilidadPorc: -6.25,
        status: 'warning',
        statusMessage: 'Utilidad negativa',
        generalInfo: { ...mockGeneralInfo, importadorAWB: '230-6586-1228', pesoCobrable: 850, grossWeight: 680, exporter: 'SEAFRESH' },
        compraVentaItems: mockCompraVentaItems.slice(0, 3),
        deductionItems: mockDeductionItems,
        commissionItems: [],
        policyRule: { ...mockPolicyRule, ruleNumber: 'R-2024-0921', consignee: 'DHL GLOBAL FORWARDING', carrier: 'LH - BOG FRA MIA' }
    },
    {
        id: 'ship-4',
        awb: '230-6587-1229',
        consignee: 'KUEHNE + NAGEL N.V',
        weight: 1100,
        ruleNumber: 'R-2024-0847',
        totalCobros: 1320.00,
        totalPagos: 1045.00,
        utilidad: 275.00,
        utilidadPorc: 20.8,
        status: 'valid',
        generalInfo: { ...mockGeneralInfo, importadorAWB: '230-6587-1229', pesoCobrable: 1100, grossWeight: 880 },
        compraVentaItems: mockCompraVentaItems,
        deductionItems: mockDeductionItems,
        commissionItems: mockCommissionItems,
        policyRule: mockPolicyRule
    },
    {
        id: 'ship-5',
        awb: '230-6588-1230',
        consignee: 'PANALPINA WORLD TRANSPORT',
        weight: 1450,
        ruleNumber: 'R-2024-0847',
        totalCobros: 1740.00,
        totalPagos: 1450.00,
        utilidad: 290.00,
        utilidadPorc: 16.7,
        status: 'warning',
        statusMessage: 'Peso > 1000kg - Validar tarifa',
        generalInfo: { ...mockGeneralInfo, importadorAWB: '230-6588-1230', pesoCobrable: 1450, grossWeight: 1160, exporter: 'ECUAFISH' },
        compraVentaItems: mockCompraVentaItems,
        deductionItems: [],
        commissionItems: mockCommissionItems,
        policyRule: { ...mockPolicyRule, consignee: 'PANALPINA WORLD TRANSPORT' }
    },
    {
        id: 'ship-6',
        awb: '230-6589-1231',
        consignee: 'KUEHNE + NAGEL N.V',
        weight: 780,
        ruleNumber: 'R-2024-0847',
        totalCobros: 936.00,
        totalPagos: 780.00,
        utilidad: 156.00,
        utilidadPorc: 16.7,
        status: 'valid',
        generalInfo: { ...mockGeneralInfo, importadorAWB: '230-6589-1231', pesoCobrable: 780, grossWeight: 624 },
        compraVentaItems: mockCompraVentaItems.slice(0, 4),
        deductionItems: [],
        commissionItems: mockCommissionItems,
        policyRule: mockPolicyRule
    },
    {
        id: 'ship-7',
        awb: '230-6590-1232',
        consignee: 'DB SCHENKER',
        weight: 1650,
        ruleNumber: 'R-2024-0921',
        totalCobros: 1980.00,
        totalPagos: 1650.00,
        utilidad: 330.00,
        utilidadPorc: 16.7,
        status: 'warning',
        statusMessage: 'Peso > 1000kg - Validar tarifa',
        generalInfo: { ...mockGeneralInfo, importadorAWB: '230-6590-1232', pesoCobrable: 1650, grossWeight: 1320, exporter: 'MARINEX' },
        compraVentaItems: mockCompraVentaItems,
        deductionItems: mockDeductionItems,
        commissionItems: [],
        policyRule: { ...mockPolicyRule, ruleNumber: 'R-2024-0921', consignee: 'DB SCHENKER', carrier: 'AA - BOG MIA' }
    }
];
