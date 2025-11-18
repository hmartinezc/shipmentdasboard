
export type RubroType = 'compra' | 'venta' | 'both';

export interface RubroOption {
    value: string;
    text: string;
    type?: RubroType;
}

export type CalculationBasis = 'fijo' | 'peso_cobrable' | 'gross_weight' | 'piezas' | 'volumen' | 'freight_charge' | 'due_agent' | 'due_carrier';

export interface ExporterOption {
    value: string;
    text: string;
}

export type GeneralInfoKey = 'fechaVuelo' | 'importadorAWB' | 'ruta' | 'piezas' | 'grossWeight' | 'volumen' | 'pesoCobrable' | 'tipoCorte' | 'tipoRate' | 'tarifaCompra' | 'tarifaVenta' | 'rangoPeso' | 'exporter' | 'freightCharge' | 'dueAgent' | 'dueCarrier';

export type GeneralInfo = Record<GeneralInfoKey, string | number>;

export interface BaseValues {
    fijo: number;
    peso_cobrable: number;
    gross_weight: number;
    piezas: number;
    volumen: number;
    freight_charge: number;
    due_agent: number;
    due_carrier: number;
}

export interface CompraVentaItem {
    id: string;
    type: 'compraVenta';
    rubro: string;
    rubroValue: string;
    rubroType: RubroType;
    baseKey: CalculationBasis;
    valorCompra: number;
    valorVenta: number;
}

export interface DeductionItem {
    id: string;
    type: 'deductions';
    rubro: string;
    baseKey: CalculationBasis;
    valor: number;
    extraInfo: string;
}

export interface CommissionItem {
    id: string;
    type: 'commissions';
    rubro: string;
    baseKey: CalculationBasis;
    valor: number;
    extraInfo: string;
}

export type FinancialItem = CompraVentaItem | DeductionItem | CommissionItem;

export type TabType = 'compraVenta' | 'deductions' | 'commissions';

export interface Totals {
    totalCobros: number;
    totalPagos: number;
    totalDeducciones: number;
    totalComisiones: number;
    utilidad: number;
    utilidadPorc: number;
}

export type ViewMode = 'liquidacion' | 'politicas' | 'resumen' | 'detalle';

export interface PolicyItem {
    name: string;
    charge: number | string;
    payable: number | string;
    diff: number | string;
}

export interface PolicyRule {
    ruleNumber: string;
    consignee: string;
    carrier: string;
    ruleType: string;
    season: string;
    salesRep: string;
    daysOfWeek: string[];
    weightRange: string;
    ratePerKg: string;
    items: PolicyItem[];
    total: {
        charge: number;
        payable: number;
        diff: number;
    };
}

export type ShipmentStatus = 'valid' | 'warning' | 'error';

export interface ShipmentSummary {
    id: string;
    awb: string;
    consignee: string;
    weight: number;
    ruleNumber: string;
    totalCobros: number;
    totalPagos: number;
    utilidad: number;
    utilidadPorc?: number;  // Opcional para compatibilidad
    status: ShipmentStatus;
    statusMessage?: string;
    generalInfo: GeneralInfo;
    compraVentaItems: CompraVentaItem[];
    deductionItems: DeductionItem[];
    commissionItems: CommissionItem[];
    policyRule: PolicyRule;
}

export interface ConsolidatedTotals {
    totalShipments: number;
    totalCobros: number;
    totalPagos: number;
    totalUtilidad: number;
    totalUtilidadPorc?: number;  // Opcional para compatibilidad
    validCount: number;
    warningCount: number;
    errorCount: number;
}
