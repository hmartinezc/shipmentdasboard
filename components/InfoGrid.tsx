
import Card from './Card';
import InfoItem from './InfoItem';
import { EXPORTER_OPTIONS, currencyFormatter } from '../constants';
import type { GeneralInfo, GeneralInfoKey, Totals, ExporterOption } from '../types';

interface InfoGridProps {
    generalInfo: GeneralInfo;
    updateGeneralInfo: (key: GeneralInfoKey, value: string | number) => void;
    totals: Totals;
    exporterOptions?: ExporterOption[];
}

const InfoGrid = ({ generalInfo, updateGeneralInfo, totals, exporterOptions }: InfoGridProps) => {
    const totalGeneral = (generalInfo.freightCharge as number) + (generalInfo.dueAgent as number) + (generalInfo.dueCarrier as number);

    const effectiveExporterOptions = exporterOptions || EXPORTER_OPTIONS;
    const exporterText = effectiveExporterOptions.find(opt => opt.value === generalInfo.exporter)?.text || '';

    return (
        <Card title="Información General" icon="infoCircle">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                <InfoItem label="Fecha de Vuelo" value={generalInfo.fechaVuelo as string} />
                <InfoItem label="Importador/AWB" value={generalInfo.importadorAWB as string} highlight />
                <InfoItem label="Ruta" value={generalInfo.ruta as string} />
                <InfoItem label="Piezas/Bultos" value={generalInfo.piezas} onUpdate={(val) => updateGeneralInfo('piezas', val)} isEditable />
                <InfoItem label="Gross Weight" value={generalInfo.grossWeight} suffix="kg" onUpdate={(val) => updateGeneralInfo('grossWeight', val)} isEditable />
                <InfoItem label="Volumen" value={generalInfo.volumen} suffix="m³" onUpdate={(val) => updateGeneralInfo('volumen', val)} isEditable />
                <InfoItem label="Peso Cobrable" value={generalInfo.pesoCobrable} suffix="kg" onUpdate={(val) => updateGeneralInfo('pesoCobrable', val)} isEditable highlight />
                <InfoItem label="Tipo Corte" value={generalInfo.tipoCorte as string} />
                <InfoItem label="Tipo Rate" value={generalInfo.tipoRate as string} />
                <InfoItem label="Tarifa Compra" value={generalInfo.tarifaCompra} onUpdate={(val) => updateGeneralInfo('tarifaCompra', val)} isEditable />
                <InfoItem label="Tarifa de Venta" value={generalInfo.tarifaVenta} onUpdate={(val) => updateGeneralInfo('tarifaVenta', val)} isEditable highlight />
                <InfoItem label="Rango Peso" value={generalInfo.rangoPeso as string} />
                <InfoItem
                    label="Exportador"
                    value={exporterText}
                    isEditable
                    editAs="select"
                    options={effectiveExporterOptions}
                    onUpdate={(val) => updateGeneralInfo('exporter', val)}
                    className="sm:col-span-2"
                    highlight
                />
                <InfoItem label="Freight Charge" value={generalInfo.freightCharge} prefix="$" onUpdate={(val) => updateGeneralInfo('freightCharge', val)} isEditable />
                <InfoItem label="Due Agent" value={generalInfo.dueAgent} prefix="$" onUpdate={(val) => updateGeneralInfo('dueAgent', val)} isEditable />
                <InfoItem label="Due Carrier" value={generalInfo.dueCarrier} prefix="$" onUpdate={(val) => updateGeneralInfo('dueCarrier', val)} isEditable />
                <InfoItem label="Total" value={currencyFormatter.format(totalGeneral)} highlight />
            </div>
        </Card>
    );
};

export default InfoGrid;
