import { ViewMode } from '../types';
import Icon from './icons/Icon';

interface PageHeaderProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onCancel?: () => void;
  onSave?: () => void;
}

const PageHeader = ({ viewMode, onViewModeChange, onCancel, onSave }: PageHeaderProps) => {
  return (
    <header className="col-span-1 lg:col-span-2 flex flex-col sm:flex-row justify-between items-center px-2.5 py-2 bg-[#7034d5] rounded-lg shadow-lg text-white mb-1.5">
      <h1 className="text-xs font-bold flex items-center gap-1.5 mb-1.5 sm:mb-0">
        <div className="bg-white/20 backdrop-blur-sm w-7 h-7 rounded-lg flex items-center justify-center shadow-md">
          <Icon name="boxesStacked" className="w-4 h-4 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] text-purple-100 font-normal">Liquidación de Embarque</span>
          <span className="font-mono text-xs text-white">#230-6584-1226</span>
        </div>
      </h1>

      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg p-0.5">
        <button
          type="button"
          onClick={() => onViewModeChange('liquidacion')}
          className={`px-3 py-1.5 rounded-md text-[10px] font-semibold transition-all flex items-center gap-1.5 ${
            viewMode === 'liquidacion' ? 'bg-white text-[#7034d5] shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <Icon name="calculator" className="w-3 h-3" />
          Liquidación
        </button>
        <button
          type="button"
          onClick={() => onViewModeChange('politicas')}
          className={`px-3 py-1.5 rounded-md text-[10px] font-semibold transition-all flex items-center gap-1.5 ${
            viewMode === 'politicas' ? 'bg-white text-[#7034d5] shadow-md' : 'text-white/80 hover:text-white hover:bg-white/10'
          }`}
        >
          <Icon name="fileContract" className="w-3 h-3" />
          Políticas
        </button>

        {(onCancel || onSave) && (
          <>
            <div className="w-px h-5 bg-white/30 mx-0.5" aria-hidden="true"></div>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-3 py-1.5 rounded-md text-[10px] font-semibold transition-all flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white border border-white/30"
              >
                <Icon name="times" className="w-3 h-3" />
                Cancelar
              </button>
            )}
            {onSave && (
              <button
                type="button"
                onClick={onSave}
                className="px-3 py-1.5 rounded-md text-[10px] font-bold transition-all flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-white shadow-sm hover:shadow"
              >
                <Icon name="checkCircle" className="w-3 h-3" />
                Procesar
              </button>
            )}
          </>
        )}
      </div>
    </header>
  );
};

export default PageHeader;
