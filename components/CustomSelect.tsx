import { useState, useRef, useEffect, useCallback, useMemo } from 'preact/compat';
import Icon from './icons/Icon';
import type { JSX } from 'preact';

// Make the component generic to accept any option type that has value and text
interface GenericOption {
    value: string;
    text: string;
    [key: string]: any; // Allow other properties like 'type'
}

interface CustomSelectProps<T extends GenericOption> {
    options: T[];
    value: T | null;
    onChange: (value: T | null) => void;
    placeholder?: string;
    renderOption?: (option: T) => JSX.Element;
    size?: 'default' | 'compact';
}

const CustomSelect = <T extends GenericOption>({ 
    options, 
    value, 
    onChange, 
    placeholder = 'Select...',
    renderOption,
    size = 'default'
}: CustomSelectProps<T>) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    // ✅ OPTIMIZACIÓN: useCallback para evitar recrear listener
    const handleClickOutside = useCallback((event: MouseEvent) => {
        const el = wrapperRef.current;
        if (!el) return;

        // Support Shadow DOM: use composedPath when available to detect inside clicks
        const anyEvent = event as MouseEvent & { composedPath?: () => EventTarget[] };
        const path = typeof anyEvent.composedPath === 'function' ? anyEvent.composedPath() : undefined;
        const isInside = path ? path.includes(el) : el.contains(event.target as Node);

        if (!isInside) {
            setIsOpen(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen, handleClickOutside]);

    // ✅ OPTIMIZACIÓN: Memoizar filtrado de opciones
    const filteredOptions = useMemo(() => 
        options.filter(option =>
            option.text.toLowerCase().includes(searchTerm.toLowerCase())
        ),
        [options, searchTerm]
    );

    // ✅ OPTIMIZACIÓN: useCallback para handlers
    const handleSelect = useCallback((option: T) => {
        onChange(option);
        setIsOpen(false);
        setSearchTerm('');
    }, [onChange]);

    const toggleOpen = useCallback(() => {
        setIsOpen(prev => !prev);
    }, []);
    
    // Use the passed render function or a default one
    const displayOption = (option: T) => {
        if (renderOption) {
            return renderOption(option);
        }
        return <span>{option.text}</span>;
    };

    const sizeClasses = size === 'compact'
        ? 'h-[22px] text-[10px] px-1.5'
        : 'h-[24px] text-[11px] px-2';

    return (
        <div className="relative w-full" ref={wrapperRef}>
            <button
                type="button"
                className={`w-full ${sizeClasses} border border-slate-300 rounded text-left flex justify-between items-center transition-all bg-white shadow-sm text-primary focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 hover:border-slate-400`}
                onClick={toggleOpen}
            >
                <div className="flex-1 min-w-0 overflow-hidden">
                    {value ? displayOption(value) : <span className="text-gray-400">{placeholder}</span>}
                </div>
                <Icon name="chevronDown" className={`w-3 h-3 text-gray-400 transition-transform ml-1.5 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute top-full mt-1 w-full bg-white border border-slate-300 rounded-md shadow-lg z-50">
                    <div className="p-1 border-b border-gray-200 bg-slate-50 sticky top-0">
                        <input
                            type="text"
                            placeholder="Buscar..."
                            className="w-full px-2 py-1 border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm((e.currentTarget as HTMLInputElement).value)}
                            onMouseDown={(e) => e.stopPropagation()}
                            autoFocus
                        />
                    </div>
                    <ul className="py-1 max-h-60 overflow-y-auto">
                        {filteredOptions.length > 0 ? filteredOptions.map(option => (
                            <li
                                key={option.value}
                                className="px-3 py-2 text-xs hover:bg-blue-50 cursor-pointer transition-colors"
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    handleSelect(option);
                                }}
                            >
                                {displayOption(option)}
                            </li>
                        )) : <li className="px-3 py-2 text-xs text-gray-400">No hay resultados</li>}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
