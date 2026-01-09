import { memo } from 'preact/compat';
import ShipmentTableRow from './ShipmentTableRow';

// ✅ OPTIMIZACIÓN: Memoizar fila de tabla para evitar re-renders innecesarios
// NOTA: Este componente ahora se memoiza inline en MultipleLiquidationSummary
// para mejor control. Este archivo se mantiene por retrocompatibilidad.
export default memo(ShipmentTableRow, (prevProps, nextProps) => {
    return (
        prevProps.shipment.id === nextProps.shipment.id &&
        prevProps.shipment.status === nextProps.shipment.status &&
        prevProps.shipment.utilidad === nextProps.shipment.utilidad &&
        prevProps.index === nextProps.index &&
        prevProps.isExpanded === nextProps.isExpanded
    );
});
