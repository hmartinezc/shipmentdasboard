/**
 * WEB COMPONENT WRAPPER
 * =====================
 * Convierte el modal de liquidación Preact en un Web Component nativo
 * con Shadow DOM para aislamiento CSS 100% garantizado.
 * 
 * @package preact-custom-element
 * @see https://github.com/preactjs/preact-custom-element
 * 
 * VENTAJAS:
 * - Shadow DOM automático = CSS 100% aislado del CSS global de ASP.NET
 * - Web Component estándar = Reutilizable en cualquier framework
 * - API nativa del browser = No vendor lock-in
 * - Solo +3KB al bundle final
 * 
 * USO EN ASP.NET RAZOR PAGES:
 * <liquidation-modal id="myModal"></liquidation-modal>
 * <script>
 *   const modal = document.querySelector('liquidation-modal');
 *   modal.open({ shipments: [...], mode: 'multiple' });
 * </script>
 */

import { lazy, Suspense } from 'preact/compat';
import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
// Importación inline: Vite convierte el CSS en string, evitando archivo separado
// y permitiendo incrustar estilos dentro del Shadow DOM.
import styles from './index.css?inline';
// Exponer en window para lógica existente que busca __LIQUIDATION_STYLES__
(window as any).__LIQUIDATION_STYLES__ = styles;
import { mockMultipleShipments } from './data/mockData';
import type { ShipmentSummary, ExporterOption, RubroOption } from './types';

// ✅ OPTIMIZACIÓN: Lazy load del componente principal
const App = lazy(() => import('./App'));

// Interfaz de configuración del modal
export interface LiquidationModalConfig {
    shipments: ShipmentSummary[];
    mode?: 'single' | 'multiple';
    exporterOptions?: ExporterOption[];
    rubroOptions?: {
        compraVenta: RubroOption[];
        deductions: RubroOption[];
        commissions: RubroOption[];
    };
    onSave?: (data: any) => Promise<void>;
    onCancel?: () => void;
}

// ✅ OPTIMIZACIÓN: Loading component ligero
const LoadingFallback = () => (
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #eff6ff 50%, #eef2ff 100%)'
    }}>
        <div style={{ textAlign: 'center' }}>
            <div style={{
                width: '48px',
                height: '48px',
                border: '4px solid #2563eb',
                borderTopColor: 'transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto'
            }}></div>
            <p style={{ marginTop: '16px', color: '#4b5563', fontWeight: 500 }}>Cargando...</p>
        </div>
    </div>
);

// Componente interno del modal
const ModalContent = ({ config }: { config: LiquidationModalConfig }) => {
    const handleSave = async (payload: any) => {
        if (config.onSave) {
            try {
                await config.onSave(payload);
                const closeEvent = new CustomEvent('liquidation-close', { bubbles: true, composed: true });
                document.dispatchEvent(closeEvent);
            } catch (error) {
                console.error('Error al guardar:', error);
                alert('Error al procesar la liquidación');
            }
        }
    };

    const handleCancel = () => {
        if (config.onCancel) {
            config.onCancel();
        }
        // Disparar evento personalizado para cerrar
        const closeEvent = new CustomEvent('liquidation-close', { bubbles: true, composed: true });
        document.dispatchEvent(closeEvent);
    };

    // Cerrar con tecla ESC
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleCancel();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, []);

    return (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center"
        >
            {/* Overlay */}
            <div 
                className="fixed inset-0 bg-black/40 z-[9998]"
                onClick={handleCancel}
            />
            
            {/* Contenedor del modal */}
            <div 
                className="w-full h-full overflow-auto bg-white p-1.5 z-[9999]"
                onClick={(e) => e.stopPropagation()}
            >
                <Suspense fallback={<LoadingFallback />}>
                    <App 
                        shipmentsData={config.shipments}
                        mode={config.mode || 'multiple'}
                        exporterOptions={config.exporterOptions}
                        rubroOptions={config.rubroOptions}
                        onSave={handleSave}
                        onCancel={handleCancel}
                        isModal={true}
                    />
                </Suspense>
            </div>
        </div>
    );
};

/**
 * COMPONENTE PRINCIPAL DEL WEB COMPONENT
 * Wrapper que maneja el estado y expone la API pública
 */
const LiquidationModalWrapper = ({ host }: { host: HTMLElement }) => {
    const [config, setConfig] = useState<LiquidationModalConfig | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // Prevenir scroll del body cuando el modal está abierto
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    // Escuchar eventos personalizados para abrir/cerrar SOLO del host
    useEffect(() => {
        const handleOpen = (e: CustomEvent) => {
            setConfig(e.detail);
            setIsOpen(true);
        };

        const handleClose = () => {
            setIsOpen(false);
            setTimeout(() => setConfig(null), 300); // Delay para animación
        };

        host.addEventListener('liquidation-open', handleOpen as EventListener);
        host.addEventListener('liquidation-close', handleClose);

        return () => {
            host.removeEventListener('liquidation-open', handleOpen as EventListener);
            host.removeEventListener('liquidation-close', handleClose);
        };
    }, []);

    if (!isOpen || !config) {
        return null;
    }

    return <ModalContent config={config} />;
};

/**
 * ✨ REGISTRO DEL WEB COMPONENT
 * 
 * Convierte el componente Preact en un Web Component nativo
 * con Shadow DOM para aislamiento CSS total.
 * 
 * CONFIGURACIÓN:
 * - Nombre del tag: <liquidation-modal>
 * - Shadow DOM: Habilitado (mode: 'open')
 * - Props observadas: Ninguna (usa eventos personalizados)
 */
// Base URL del script actual para ubicar correctamente el CSS
const __LIQ_BASE__ = (() => {
    const s = (document.currentScript as HTMLScriptElement | null);
    if (!s) return '';
    const url = new URL(s.src, window.location.href);
    url.pathname = url.pathname.replace(/[^/]+$/, '');
    return url.href;
})();

class LiquidationModalElement extends HTMLElement {
    private mount?: HTMLDivElement;
    private cleanup?: () => void;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        if (!this.shadowRoot) return;

        // Inyectar CSS embebido – ya no se genera archivo externo ni se carga Font Awesome
        const existing = this.shadowRoot.querySelector('[data-style="liquidation"]');
        if (!existing) {
            const style = document.createElement('style');
            style.setAttribute('data-style', 'liquidation');
            style.textContent = (window as any).__LIQUIDATION_STYLES__ || styles;
            this.shadowRoot.appendChild(style);
        }

        // Nodo de montaje para Preact
        if (!this.mount) {
            this.mount = document.createElement('div');
            this.shadowRoot.appendChild(this.mount);
        }

        // Render del wrapper pasando referencia al host
        render(<LiquidationModalWrapper host={this} />, this.mount);
    }

    disconnectedCallback() {
        if (this.mount) {
            render(null, this.mount);
        }
    }

    // API pública
    open(config: LiquidationModalConfig) {
        const event = new CustomEvent('liquidation-open', { detail: config, bubbles: false, composed: false });
        this.dispatchEvent(event);
    }
    close() {
        const event = new CustomEvent('liquidation-close', { bubbles: false, composed: false });
        this.dispatchEvent(event);
    }
}

customElements.define('liquidation-modal', LiquidationModalElement);

/**
 * API GLOBAL PARA COMPATIBILIDAD CON CÓDIGO EXISTENTE
 * Permite usar window.LiquidationApp.open() como antes
 */
declare global {
    interface Window {
        LiquidationApp: {
            open: (config: LiquidationModalConfig) => void;
            close: () => void;
        };
    }
}

const LiquidationAPI = {
    /**
     * Abre el modal de liquidación
     * @param config - Configuración del modal
     */
    open: (config: LiquidationModalConfig) => {
        // Buscar o crear el elemento
        let el = document.querySelector('liquidation-modal') as any;
        if (!el) {
            el = document.createElement('liquidation-modal') as any;
            document.body.appendChild(el);
        }
        if (typeof el.open === 'function') {
            el.open(config);
        } else {
            // Fallback por si el custom element aún no está definido
            const event = new CustomEvent('liquidation-open', { detail: config });
            el.dispatchEvent(event);
        }
    },

    /**
     * Cierra el modal de liquidación
     */
    close: () => {
        const el = document.querySelector('liquidation-modal') as any;
        if (el && typeof el.close === 'function') {
            el.close();
        } else if (el) {
            el.dispatchEvent(new CustomEvent('liquidation-close'));
        }
    }
};

// Exponer en window (compatibilidad con código existente)
window.LiquidationApp = LiquidationAPI;

// ✅ MODO DESARROLLO: Auto-abrir con datos de prueba
const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

if (isDev) {
    console.log('🚀 Modo desarrollo: Modal API disponible en window.LiquidationApp');
    console.log('Ejemplo: window.LiquidationApp.open({ shipments: [...], mode: "multiple" })');
    
    // Auto-abrir en dev para testing - MODO SINGLE para probar agregar items
    setTimeout(() => {
        window.LiquidationApp.open({
            shipments: [mockMultipleShipments[0]], // Solo el primer shipment
            mode: 'single',  // Modo single para permitir edición
            onSave: async (data) => {
                console.log('💾 Guardar datos:', data);
                await new Promise(resolve => setTimeout(resolve, 1000));
                alert('Liquidación procesada (DEMO)');
            },
            onCancel: () => {
                console.log('❌ Cancelado');
            }
        });
    }, 500);
} else {
    // En producción, confirmar que la API está disponible
    console.log('✅ LiquidationApp loaded - window.LiquidationApp ready');
}

export default LiquidationAPI;
