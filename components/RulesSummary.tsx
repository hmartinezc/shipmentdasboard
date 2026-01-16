import { useMemo } from 'preact/compat';
import Card from './Card';
import Icon from './icons/Icon';
import type { PolicyRule, CompraVentaItem } from '../types';

interface RulesSummaryProps {
  rule: PolicyRule;
  compraVentaItems?: CompraVentaItem[];  // Items procesados con matching para detectar conflictos
}

// Función para normalizar nombres (igual que en useFinancials)
const normalizeRubroName = (name: string): string => {
    return name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, ' ')
        .replace(/[^a-z0-9\s]/g, '');
};

const RulesSummary = ({ rule, compraVentaItems = [] }: RulesSummaryProps) => {
  // Crear un mapa de conflictos desde compraVentaItems
  const conflictMap = useMemo(() => {
    const map = new Map<string, { hasConflict: boolean; reason?: string }>();
    for (const item of compraVentaItems) {
      const key = normalizeRubroName(item.rubro);
      if (item.hasConflict) {
        map.set(key, { hasConflict: true, reason: item.conflictReason });
      }
    }
    return map;
  }, [compraVentaItems]);

  // ✅ Fusionar items de política con el mismo nombre en una sola fila
  // Ejemplo: FUEL SURCHARGE (charge: 0.15, payable: 0) + FUEL SURCHARGE (charge: 0, payable: 0.15)
  //       → FUEL SURCHARGE (charge: 0.15, payable: 0.15)
  const processedItems = useMemo(() => {
    const merged: Array<{
      name: string;
      charge: number | string;
      payable: number | string;
      diff: number | string;
      hasConflict?: boolean;
      conflictReason?: string;
    }> = [];
    const nameMap = new Map<string, number>(); // nombreNormalizado -> index en merged

    for (const item of rule.items) {
      const key = normalizeRubroName(item.name);
      const existingIndex = nameMap.get(key);
      
      if (existingIndex !== undefined) {
        // Ya existe un item con el mismo nombre → FUSIONAR
        const existing = merged[existingIndex];
        const existingCharge = typeof existing.charge === 'number' ? existing.charge : parseFloat(existing.charge as string) || 0;
        const existingPayable = typeof existing.payable === 'number' ? existing.payable : parseFloat(existing.payable as string) || 0;
        const itemCharge = typeof item.charge === 'number' ? item.charge : parseFloat(item.charge as string) || 0;
        const itemPayable = typeof item.payable === 'number' ? item.payable : parseFloat(item.payable as string) || 0;
        
        const newCharge = existingCharge > 0 ? existingCharge : itemCharge;
        const newPayable = existingPayable > 0 ? existingPayable : itemPayable;
        const newDiff = newCharge - newPayable;
        
        merged[existingIndex] = {
          ...existing,
          charge: newCharge,
          payable: newPayable,
          diff: newDiff,
        };
      } else {
        // Nuevo item
        const conflict = conflictMap.get(key);
        const itemCharge = typeof item.charge === 'number' ? item.charge : parseFloat(item.charge as string) || 0;
        const itemPayable = typeof item.payable === 'number' ? item.payable : parseFloat(item.payable as string) || 0;
        
        nameMap.set(key, merged.length);
        merged.push({
          name: item.name,
          charge: itemCharge,
          payable: itemPayable,
          diff: itemCharge - itemPayable,
          hasConflict: conflict?.hasConflict || false,
          conflictReason: conflict?.reason
        });
      }
    }
    
    return merged;
  }, [rule.items, conflictMap]);
  return (
    <Card
      title={
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-1.5">
            <Icon name="fileContract" className="w-3 h-3" />
            <span>Rules Summary</span>
          </div>
          <span className="font-mono font-bold text-[12px] text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
            {rule.ruleNumber}
          </span>
        </div>
      }
      icon="empty"
    >
      <div className="space-y-3">
        {/* Basic info grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 bg-slate-50 p-3 rounded-lg border border-gray-200">
          <div className="flex items-start gap-2">
            <Icon name="user" className="w-3 h-3 text-primary mt-1" />
            <div>
              <div className="text-[9px] text-gray-500 font-medium">Consignee</div>
              <div className="text-[11px] font-semibold text-primary">{rule.consignee}</div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Icon name="plane" className="w-3 h-3 text-primary mt-1" />
            <div>
              <div className="text-[9px] text-gray-500 font-medium">Carrier</div>
              <div className="text-[11px] font-semibold text-primary">{rule.carrier}</div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Icon name="tag" className="w-3 h-3 text-primary mt-1" />
            <div>
              <div className="text-[9px] text-gray-500 font-medium">Rule Type</div>
              <div className="text-[11px] font-semibold">
                <span className="inline-block bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-[10px]">
                  {rule.ruleType}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Icon name="userTie" className="w-3 h-3 text-primary mt-1" />
            <div>
              <div className="text-[9px] text-gray-500 font-medium">Sales Rep</div>
              <div className="text-[11px] font-semibold text-primary">{rule.salesRep}</div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Icon name="calendar" className="w-3 h-3 text-primary mt-1" />
            <div>
              <div className="text-[9px] text-gray-500 font-medium">Season</div>
              <div className="text-[11px] font-semibold text-primary">{rule.season}</div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <Icon name="calendarWeek" className="w-3 h-3 text-primary mt-1" />
            <div className="flex-1">
              <div className="text-[9px] text-gray-500 font-medium mb-1">Days of Week</div>
              <div className="flex gap-1">
                {["Do","Lu","Ma","Mi","Ju","Vi","Sa"].map(d => (
                  <div
                    key={d}
                    className={`w-7 h-5 flex items-center justify-center rounded text-[9px] font-semibold transition-all ${
                      rule.daysOfWeek.includes(d)
                        ? (d === 'Do' || d === 'Sa') ? 'bg-blue-500 text-white shadow-sm' : 'bg-green-500 text-white shadow-sm'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Freight rates */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="freightRates" className="w-3 h-3 text-blue-600" />
            <h3 className="text-[11px] font-bold text-blue-800">Freight Rates by Weight</h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white px-3 py-1.5 rounded border border-blue-200">
              <span className="text-[9px] text-gray-600">Weight Range: </span>
              <span className="text-[11px] font-semibold text-blue-700">{rule.weightRange}</span>
            </div>
            <div className="bg-green-100 px-3 py-1.5 rounded border border-green-300">
              <span className="text-[11px] font-bold text-green-700">{rule.ratePerKg}</span>
            </div>
          </div>
        </div>

        {/* Items table */}
        <div>
          <div style={{ background: 'linear-gradient(to right, #eef2ff, #faf5ff)', borderColor: '#c7d2fe' }} className="flex items-center gap-2 mb-2 p-2 rounded-lg border">
            <Icon name="bothArrows" className="w-3 h-3 text-indigo-600" />
            <h3 className="text-[11px] font-bold text-indigo-800">Cobros vs Pagos</h3>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden bg-white">
            <table className="w-full border-collapse text-xs">
              <thead>
                <tr style={{ background: 'linear-gradient(to right, #f1f5f9, #f8fafc)' }}>
                  <th className="p-2 text-left font-semibold text-gray-700 text-[10px] border-b border-gray-200">Items</th>
                  <th className="p-2 text-right font-semibold text-gray-700 text-[10px] border-b border-gray-200">Cobros</th>
                  <th className="p-2 text-right font-semibold text-gray-700 text-[10px] border-b border-gray-200">Pagos</th>
                  <th className="p-2 text-right font-semibold text-gray-700 text-[10px] border-b border-gray-200">Dif.</th>
                </tr>
              </thead>
              <tbody>
                {processedItems.map((it, idx) => {
                  const isConflict = it.hasConflict === true;
                  return (
                    <tr 
                      key={idx} 
                      style={{ borderBottomColor: '#f3f4f6' }} 
                      className={`border-b ${isConflict ? 'bg-amber-50 border-l-4 border-l-amber-400' : ''}`}
                      title={isConflict ? it.conflictReason : undefined}
                    >
                      <td className="p-2 text-[11px] text-gray-700">
                        <div className="flex items-center gap-1.5">
                          {isConflict && (
                            <span 
                              className="inline-flex items-center justify-center w-4 h-4 bg-amber-400 text-white rounded-full text-[9px] font-bold cursor-help"
                              title={it.conflictReason || 'Conflicto: mismo rubro con diferente base de cálculo'}
                            >
                              !
                            </span>
                          )}
                          <span className={isConflict ? 'text-amber-800 font-medium' : ''}>{it.name}</span>
                        </div>
                      </td>
                      <td className={`p-2 text-right font-mono text-[11px] ${isConflict ? 'text-amber-800' : 'text-blue-900'}`}>{typeof it.charge === 'number' ? it.charge.toFixed(2) : it.charge}</td>
                      <td className={`p-2 text-right font-mono text-[11px] ${isConflict ? 'text-amber-800' : 'text-blue-900'}`}>{typeof it.payable === 'number' ? it.payable.toFixed(2) : it.payable}</td>
                      <td className={`p-2 text-right font-mono font-semibold text-[11px] ${Number(it.diff) >= 0 ? 'text-success' : 'text-red-600'}`}>{typeof it.diff === 'number' ? it.diff.toFixed(2) : it.diff}</td>
                    </tr>
                  );
                })}
                {(() => {
                  // Calcular totales desde los items fusionados
                  const totalCharge = processedItems.reduce((sum, it) => sum + (typeof it.charge === 'number' ? it.charge : 0), 0);
                  const totalPayable = processedItems.reduce((sum, it) => sum + (typeof it.payable === 'number' ? it.payable : 0), 0);
                  const totalDiff = totalCharge - totalPayable;
                  return (
                    <tr style={{ background: 'linear-gradient(to right, #eff6ff, #dbeafe)' }}>
                      <td className="p-2 text-[11px] font-bold text-blue-900">TOTAL</td>
                      <td className="p-2 text-right font-mono font-bold text-[11px] text-blue-900">{totalCharge.toFixed(2)}</td>
                      <td className="p-2 text-right font-mono font-bold text-[11px] text-blue-900">{totalPayable.toFixed(2)}</td>
                      <td className={`p-2 text-right font-mono font-bold text-[11px] ${totalDiff >= 0 ? 'text-success' : 'text-red-600'}`}>{totalDiff.toFixed(2)}</td>
                    </tr>
                  );
                })()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default RulesSummary;
