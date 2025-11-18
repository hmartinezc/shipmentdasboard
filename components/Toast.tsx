import { useState, useEffect, createContext, useContext } from 'preact/compat';
import Icon from './icons/Icon';
import type { ComponentChildren } from 'preact';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextValue {
    toasts: Toast[];
    addToast: (message: string, type: ToastType, duration?: number) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
};

export const ToastProvider = ({ children }: { children: ComponentChildren }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = (message: string, type: ToastType, duration = 3000) => {
        const id = `toast-${Date.now()}-${Math.random()}`;
        const newToast: Toast = { id, message, type, duration };
        setToasts(prev => [...prev, newToast]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    );
};

const ToastContainer = ({ toasts, removeToast }: { toasts: Toast[]; removeToast: (id: string) => void }) => {
    return (
        <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
            {toasts.map(toast => (
                <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
            ))}
        </div>
    );
};

const ToastItem = ({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) => {
    useEffect(() => {
        if (toast.duration) {
            const timer = setTimeout(() => {
                onRemove(toast.id);
            }, toast.duration);
            return () => clearTimeout(timer);
        }
    }, [toast, onRemove]);

    const styles: Record<ToastType, { bg: string; border: string; icon: Parameters<typeof Icon>[0]['name']; iconClass: string }> = {
        success: { bg: 'bg-green-50', border: 'border-green-500', icon: 'checkCircle', iconClass: 'text-green-600' },
        error: { bg: 'bg-red-50', border: 'border-red-500', icon: 'exclamationCircle', iconClass: 'text-red-600' },
        warning: { bg: 'bg-yellow-50', border: 'border-yellow-500', icon: 'exclamationTriangle', iconClass: 'text-yellow-600' },
        info: { bg: 'bg-blue-50', border: 'border-blue-500', icon: 'infoCircle', iconClass: 'text-blue-600' }
    };

    const style = styles[toast.type];

    return (
        <div className={`${style.bg} ${style.border} border-l-4 rounded-lg shadow-lg p-4 min-w-[300px] pointer-events-auto animate-slide-in-right`}>
            <div className="flex items-start gap-3">
                <Icon name={style.icon} className={`w-4 h-4 ${style.iconClass} mt-0.5`} />
                <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{toast.message}</p>
                </div>
                <button
                    onClick={() => onRemove(toast.id)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <Icon name="times" className="w-3 h-3" />
                </button>
            </div>
        </div>
    );
};
