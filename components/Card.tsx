
import type { ComponentChildren } from 'preact';
import Icon from './icons/Icon';

interface CardProps {
    title: string | ComponentChildren;
    icon?: Parameters<typeof Icon>[0]['name'];
    children: ComponentChildren;
    className?: string;
    bodyClassName?: string;
    variant?: 'default' | 'leftAccent';
    accentColorClass?: string; // Tailwind border color class for left accent
}

const Card = ({ title, icon, children, className = '', bodyClassName = 'p-2', variant = 'default', accentColorClass = 'border-blue-400' }: CardProps) => {
    const baseContainer = 'bg-white rounded-lg shadow-md flex flex-col transition-shadow hover:shadow-lg';
    const container = variant === 'leftAccent'
        ? `${baseContainer} border-0 border-l-4 ${accentColorClass}`
        : baseContainer;
    const borderStyle = variant === 'default' ? { border: '1px solid #e2e8f0' } : undefined;
    return (
        <div className={`${container} ${className}`} style={borderStyle}>
            <div style={{ borderBottomColor: '#9333ea' }} className="px-2.5 py-1.5 bg-[#7034d5] border-b flex justify-between items-center rounded-t-lg">
                {typeof title === 'string' ? (
                    <h2 className="text-[11px] font-bold text-white flex items-center gap-1">
                        {icon && <Icon name={icon} className="w-3 h-3 text-purple-100" />}
                        {title}
                    </h2>
                ) : (
                    <div className="text-[11px] font-bold text-white flex items-center gap-1 w-full">
                        {title}
                    </div>
                )}
            </div>
            <div className={`card__body ${bodyClassName}`}>
                {children}
            </div>
        </div>
    );
};

export default Card;
