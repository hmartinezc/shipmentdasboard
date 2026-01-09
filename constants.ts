
import type { GeneralInfo, ExporterOption, RubroOption } from './types';

export const INITIAL_GENERAL_INFO: GeneralInfo = {
    fechaVuelo: '2025-06-13',
    importadorAWB: '230-6584-1226',
    ruta: 'GYE/PTY/MIA',
    piezas: 12,
    grossWeight: 680.00,
    volumen: 87459.325,
    pesoCobrable: 900,
    tipoCorte: 'P (Prepaid)',
    tipoRate: 'Normal',
    tarifaCompra: 0.85,
    tarifaVenta: 0.95,
    rangoPeso: '100kg-9000kg',
    exporter: 'ODFISH',
    freightCharge: 260.85,
    dueAgent: 330.00,
    dueCarrier: 25.00,
    totalHijas: 0
};

export const EXPORTER_OPTIONS: ExporterOption[] = [
    { value: 'ODFISH', text: 'ODFISH-ODFISH EXPORT S.A.S.' },
    { value: 'PRODUMAR', text: 'PRODUMAR S.A.' },
    { value: 'EXPORKLIP', text: 'EXPORKLIP S.A.' },
    { value: 'OCEANFISH', text: 'OCEANFISH S.A.' }
];

export const RUBRO_OPTIONS: Record<string, RubroOption[]> = {
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

export const CALCULATION_BASIS_OPTIONS: { value: string; label: string }[] = [
    { value: 'fijo', label: 'Valor Fijo' },
    { value: 'peso_cobrable', label: 'x Peso Cobrable' },
    { value: 'gross_weight', label: 'x Gross Weight' },
    { value: 'piezas', label: 'x Piezas' },
    { value: 'volumen', label: 'x Volumen' },
    { value: 'freight_charge', label: 'x Freight Charge' },
    { value: 'due_agent', label: 'x Due Agent' },
    { value: 'due_carrier', label: 'x Due Carrier' },
    { value: 'hijas', label: 'x Total Hijas' }
];

export const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
