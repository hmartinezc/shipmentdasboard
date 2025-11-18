import type { ShipmentSummary } from '../types';
import Icon from './icons/Icon';

interface ShipmentTableRowProps {
	shipment: ShipmentSummary;
	index: number;
	onViewDetails: (shipmentId: string) => void;
	isExpanded?: boolean;
}

const statusBadge = (status: ShipmentSummary['status']) => {
	if (status === 'valid') return 'bg-green-100 text-green-700 border-green-300';
	if (status === 'warning') return 'bg-yellow-100 text-yellow-700 border-yellow-300';
	return 'bg-red-100 text-red-700 border-red-300';
};

const statusIcon = (status: ShipmentSummary['status']): Parameters<typeof Icon>[0]['name'] => {
	if (status === 'valid') return 'checkCircle';
	if (status === 'warning') return 'exclamationTriangle';
	return 'times';
};

const statusLabel = (status: ShipmentSummary['status']) => {
	if (status === 'valid') return 'Válida';
	if (status === 'warning') return 'Advertencia';
	return 'Error';
};

const ShipmentTableRow = ({ shipment, index, onViewDetails, isExpanded = false }: ShipmentTableRowProps) => {
	return (
		<tr className="hover:bg-slate-50 cursor-pointer" onClick={() => onViewDetails(shipment.id)}>
			<td className="px-1.5 py-1.5 text-center text-[10px] text-gray-600">
				<span className="inline-flex items-center gap-1">
					<Icon name={isExpanded ? 'chevronDown' : 'chevronRight'} className="w-3 h-3 text-gray-400" />
					{index + 1}
				</span>
			</td>
			<td className="px-1.5 py-1.5 text-left text-[11px] font-mono font-semibold text-blue-900">{shipment.awb}</td>
			<td className="px-1.5 py-1.5 text-left text-[11px] text-gray-800">{shipment.consignee}</td>
			<td className="px-1.5 py-1.5 text-right text-[11px] font-mono text-gray-800">{shipment.weight.toLocaleString()}</td>
			<td className="px-1.5 py-1.5 text-center">
				<span className="inline-block bg-indigo-50 text-indigo-700 text-[10px] px-2 py-0.5 rounded border border-indigo-200 font-semibold">
					{shipment.ruleNumber}
				</span>
			</td>
			<td className="px-1.5 py-1.5 text-right text-[11px] font-mono font-semibold">
				<span className={shipment.utilidad >= 0 ? 'text-green-700' : 'text-red-600'}>
					{shipment.utilidad.toFixed(2)}
				</span>
			</td>
			<td className="px-1.5 py-1.5 text-center">
				<span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border ${statusBadge(shipment.status)}`}>
					<Icon name={statusIcon(shipment.status)} className="w-3 h-3" />
					{statusLabel(shipment.status)}
				</span>
			</td>
		</tr>
	);
};

export default ShipmentTableRow;
