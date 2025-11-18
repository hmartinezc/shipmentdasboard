import { memo } from 'preact/compat';
import ShipmentTableRow from './ShipmentTableRow';

// ✅ OPTIMIZACIÓN: Memoizar fila de tabla para evitar re-renders innecesarios
export default memo(ShipmentTableRow, (prevProps, nextProps) => {
    // Solo re-renderizar si cambian props relevantes
    return (
        prevProps.shipment.id === nextProps.shipment.id &&
        prevProps.shipment.status === nextProps.shipment.status &&
        prevProps.shipment.totalCobros === nextProps.shipment.totalCobros &&
        prevProps.shipment.totalPagos === nextProps.shipment.totalPagos &&
        prevProps.shipment.utilidad === nextProps.shipment.utilidad
    );
});
