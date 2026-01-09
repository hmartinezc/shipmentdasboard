
export type RubroType = 'compra' | 'venta' | 'both';

export interface RubroOption {
    value: string;
    text: string;
    type?: RubroType;
    chargeId?: string;   // ID del rubro para persistencia en BD
    iataCode?: string;   // Código IATA del rubro
}

export type CalculationBasis = 'fijo' | 'peso_cobrable' | 'gross_weight' | 'piezas' | 'volumen' | 'freight_charge' | 'due_agent' | 'due_carrier' | 'hijas';

export interface ExporterOption {
    value: string;
    text: string;
}

export type GeneralInfoKey = 'fechaVuelo' | 'importadorAWB' | 'ruta' | 'piezas' | 'grossWeight' | 'volumen' | 'pesoCobrable' | 'tipoCorte' | 'tipoRate' | 'tarifaCompra' | 'tarifaVenta' | 'rangoPeso' | 'exporter' | 'freightCharge' | 'dueAgent' | 'dueCarrier' | 'totalHijas';

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
    hijas: number;
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
    chargeId?: string;   // ID del rubro para persistencia en BD
    iataCode?: string;   // Código IATA del rubro
}

export interface DeductionItem {
    id: string;
    type: 'deductions';
    rubro: string;
    baseKey: CalculationBasis;
    valor: number;
    extraInfo: string;
    chargeId?: string;   // ID del rubro para persistencia en BD
    iataCode?: string;   // Código IATA del rubro
}

export interface CommissionItem {
    id: string;
    type: 'commissions';
    rubro: string;
    baseKey: CalculationBasis;
    valor: number;
    extraInfo: string;
    chargeId?: string;   // ID del rubro para persistencia en BD
    iataCode?: string;   // Código IATA del rubro
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

// Payload enriquecido para guardar en backend desde modo "single"
export interface CompraVentaItemCalculated extends CompraVentaItem {
    totalCompra: number;
    totalVenta: number;
    utilidadItem: number;
}

export interface DeductionOrCommissionCalculated {
    id: string;
    type: 'deductions' | 'commissions';
    rubro: string;
    baseKey: CalculationBasis;
    valor: number;
    extraInfo: string;
    total: number;
    chargeId?: string;   // ID del rubro para persistencia en BD
    iataCode?: string;   // Código IATA del rubro
}

export interface SavePayloadSingle {
    generalInfo: GeneralInfo;
    baseValues: BaseValues;
    compraVentaItems: CompraVentaItemCalculated[];
    deductionItems: DeductionOrCommissionCalculated[];
    commissionItems: DeductionOrCommissionCalculated[];
    totals: Totals;
    policyRule?: PolicyRule;  // Regla de política para histórico en BD
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
