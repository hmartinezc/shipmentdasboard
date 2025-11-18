/**
 * Sistema de diseño y paleta de colores mejorada
 */

export const theme = {
    colors: {
        // Colores primarios - Azules profesionales
        primary: {
            50: '#f0f9ff',
            100: '#e0f2fe',
            200: '#bae6fd',
            300: '#7dd3fc',
            400: '#38bdf8',
            500: '#0ea5e9',
            600: '#0284c7',
            700: '#0369a1',
            800: '#075985',
            900: '#0c4a6e',
        },
        
        // Colores secundarios - Verde success
        secondary: {
            50: '#f0fdf4',
            100: '#dcfce7',
            200: '#bbf7d0',
            300: '#86efac',
            400: '#4ade80',
            500: '#22c55e',
            600: '#16a34a',
            700: '#15803d',
            800: '#166534',
            900: '#14532d',
        },
        
        // Colores de acento - Naranja/Amarillo
        accent: {
            50: '#fff7ed',
            100: '#ffedd5',
            200: '#fed7aa',
            300: '#fdba74',
            400: '#fb923c',
            500: '#f97316',
            600: '#ea580c',
            700: '#c2410c',
            800: '#9a3412',
            900: '#7c2d12',
        },
        
        // Peligro - Rojos
        danger: {
            50: '#fef2f2',
            100: '#fee2e2',
            200: '#fecaca',
            300: '#fca5a5',
            400: '#f87171',
            500: '#ef4444',
            600: '#dc2626',
            700: '#b91c1c',
            800: '#991b1b',
            900: '#7f1d1d',
        },
        
        // Neutros - Grises
        neutral: {
            50: '#fafafa',
            100: '#f5f5f5',
            200: '#e5e5e5',
            300: '#d4d4d4',
            400: '#a3a3a3',
            500: '#737373',
            600: '#525252',
            700: '#404040',
            800: '#262626',
            900: '#171717',
        }
    },
    
    // Sombras mejoradas
    shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    },
    
    // Bordes redondeados
    borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.375rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem',
        full: '9999px',
    },
    
    // Transiciones
    transitions: {
        fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
        DEFAULT: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
        slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    }
};

/**
 * Clases CSS reutilizables
 */
export const uiClasses = {
    // Tarjetas
    card: 'bg-white rounded-lg shadow-md border border-neutral-200 overflow-hidden',
    cardHeader: 'bg-gradient-to-r from-primary-600 to-primary-700 text-white px-4 py-3',
    cardBody: 'p-4',
    
    // Botones
    button: {
        base: 'px-4 py-2 rounded-md font-medium text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
        primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 shadow-sm hover:shadow',
        secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500 shadow-sm hover:shadow',
        danger: 'bg-danger-600 text-white hover:bg-danger-700 focus:ring-danger-500 shadow-sm hover:shadow',
        outline: 'bg-white border-2 border-neutral-300 text-neutral-700 hover:bg-neutral-50 focus:ring-neutral-500',
    },
    
    // Inputs
    input: {
        base: 'w-full px-3 py-2 border rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-neutral-100 disabled:cursor-not-allowed',
        default: 'border-neutral-300 bg-white',
        error: 'border-danger-500 bg-danger-50',
    },
    
    // Labels
    label: 'block text-xs font-semibold text-neutral-700 uppercase tracking-wide mb-1',
    
    // Badges
    badge: {
        base: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        success: 'bg-secondary-100 text-secondary-800',
        danger: 'bg-danger-100 text-danger-800',
        warning: 'bg-accent-100 text-accent-800',
        info: 'bg-primary-100 text-primary-800',
    },
    
    // Grids
    grid: 'grid gap-4',
    gridCols2: 'grid-cols-1 md:grid-cols-2',
    gridCols3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
};

/**
 * Helper para construir clases condicionales
 */
export const cn = (...classes: (string | boolean | undefined | null)[]): string => {
    return classes.filter(Boolean).join(' ');
};
