import { useState, useRef, useEffect } from 'preact/compat';
import Icon from './icons/Icon';
import { currencyFormatter } from '../constants';
import CustomSelect from './CustomSelect';
import type { ExporterOption } from '../types';

interface InfoItemProps {
    label: string;
    value: string | number;
    prefix?: string;
    suffix?: string;
    isEditable?: boolean;
    editAs?: 'input' | 'select';
    options?: ExporterOption[];
    onUpdate?: (value: string | number) => void;
    className?: string;
    highlight?: boolean;
}

const InfoItem = ({
    label,
    value,
    prefix = '',
    suffix = '',
    isEditable = false,
    editAs = 'input',
    options = [],
    onUpdate,
    className = '',
    highlight = false
}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [currentValue, setCurrentValue] = useState(String(value));
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setCurrentValue(String(value));
    }, [value]);
    
    useEffect(() => {
        if (isEditing && editAs === 'input' && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing, editAs]);

    const handleUpdate = (newValue: string | number) => {
        if (onUpdate) {
            onUpdate(newValue);
        }
        setIsEditing(false);
    };
    
    const handleBlur = () => {
        // For text input, save on blur
        if(editAs === 'input') {
            const numericValue = parseFloat(currentValue);
            if (!isNaN(numericValue)) {
                handleUpdate(numericValue);
            } else {
                 handleCancel();
            }
        }
        // For custom select, closing the dropdown handles the save via onChange.
    }

    const handleCancel = () => {
        setCurrentValue(String(value));
        setIsEditing(false);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Enter') handleBlur();
        if (e.key === 'Escape') handleCancel();
    };

    const formatValue = (val: string | number) => {
        if (prefix === '$') {
            return currencyFormatter.format(Number(val));
        }
        return `${prefix}${val}${suffix ? ` ${suffix}` : ''}`;
    };

    const valueClasses = `text-xs font-semibold text-primary min-h-[18px] ${isEditable ? 'cursor-pointer hover:bg-blue-100 rounded px-1 -mx-1' : ''}`;

    return (
        <div style={{
            borderLeftWidth: '2px',
            borderLeftColor: highlight ? '#3b82f6' : '#cbd5e1',
            backgroundColor: highlight ? '#eff6ff66' : '#f8fafc'
        }} className={`p-1 rounded shadow-sm relative group ${className}`}>
            <div className="text-[8px] text-gray font-medium mb-0.5 uppercase tracking-wider">{label}</div>
            {isEditing ? (
                editAs === 'input' ? (
                    <input
                        ref={inputRef}
                        type="text"
                        value={currentValue}
                        onChange={(e) => setCurrentValue(e.target.value)}
                        onBlur={handleBlur}
                        onKeyDown={handleKeyDown}
                        className="w-full border border-slate-300 rounded text-xs font-semibold text-primary px-1 py-0.5 bg-white focus:outline-none focus:ring-2 focus:ring-slate-500 font-mono"
                    />
                ) : (
                    <CustomSelect
                        options={options}
                        value={options.find(opt => opt.value === currentValue) || null}
                        onChange={(option) => {
                            if (option) {
                                handleUpdate(option.value);
                            } else {
                                handleCancel();
                            }
                        }}
                        size="compact"
                    />
                )
            ) : (
                <div className={valueClasses} onClick={() => isEditable && setIsEditing(true)}>
                    {formatValue(value)}
                    {isEditable && <Icon name="edit" className="w-3 h-3 absolute top-1.5 right-1.5 text-gray opacity-0 group-hover:opacity-70 transition-opacity" />}
                </div>
            )}
        </div>
    );
};

export default InfoItem;
