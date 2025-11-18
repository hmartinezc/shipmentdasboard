
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
    dueCarrier: 25.00
};

export const EXPORTER_OPTIONS: ExporterOption[] = [
    { value: 'ODFISH', text: 'ODFISH-ODFISH EXPORT S.A.S.' },
    { value: 'PRODUMAR', text: 'PRODUMAR S.A.' },
    { value: 'EXPORKLIP', text: 'EXPORKLIP S.A.' },
    { value: 'OCEANFISH', text: 'OCEANFISH S.A.' }
];

export const RUBRO_OPTIONS: Record<string, RubroOption[]> = {
    compraVenta: [
        { value: 'Air Freight', text: 'Air Freight', type: 'both' },
        { value: 'Fuel Surcharge', text: 'Fuel Surcharge', type: 'both' },
        { value: 'Handling', text: 'Handling', type: 'both' },
        { value: 'Insurance', text: 'Insurance', type: 'both' },
        { value: 'Security Fee', text: 'Security Fee (Carrier)', type: 'compra' },
        { value: 'AWB Fee', text: 'AWB Fee', type: 'venta' },
        { value: 'Screening', text: 'Screening', type: 'venta' },
        { value: 'IT/Customs', text: 'IT / Customs', type: 'compra' },
    ],
    deductions: [
        { value: 'Descuento por pronto pago', text: 'Descuento por pronto pago' },
        { value: 'Nota de crédito aplicada', text: 'Nota de crédito aplicada' },
        { value: 'Ajuste por peso', text: 'Ajuste por peso' },
        { value: 'Reclamo por daño', text: 'Reclamo por daño' },
    ],
    commissions: [
        { value: 'Comisión Agente Origen', text: 'Comisión Agente Origen' },
        { value: 'Comisión Agente Destino', text: 'Comisión Agente Destino' },
        { value: 'Comisión Vendedor', text: 'Comisión Vendedor' },
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
    { value: 'due_carrier', label: 'x Due Carrier' }
];

export const currencyFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
