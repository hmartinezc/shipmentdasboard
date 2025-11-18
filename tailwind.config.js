/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./liquidation-web-component.tsx",
    "./App.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hooks/**/*.{js,ts,jsx,tsx}",
  ],
  
  theme: {
    extend: {
      colors: {
        primary: '#2c3e50',
        secondary: '#7e22ce',
        accent: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
        light: '#f8f9fa',
        dark: '#343a40',
        gray: {
          DEFAULT: '#6c757d',
          light: '#f0f0f0'
        },
        'card-bg': '#ffffff',
        'row-alt': '#f9fafb',
        'brand-purple': '#7034d5',
      },
    },
  },
  
  safelist: [
    // For Shadow DOM build ensure these utilities are always emitted
    'text-primary', 'text-success', 'text-warning', 'text-danger',
    'bg-row-alt',
    // Gradient and borders used in consolidated cards
    'bg-gradient-to-br', 'bg-gradient-to-r',
    // Blue (Cobros)
    'from-blue-50', 'from-blue-100', 'to-blue-100', 'to-blue-200', 'border-blue-200', 'border-blue-300',
    // Emerald/Green (Utilidad + footers)
    'from-emerald-50', 'from-emerald-100', 'to-emerald-100', 'to-emerald-200', 'border-emerald-200', 'border-emerald-300',
    'from-green-50', 'to-emerald-50', 'border-green-200', 'border-green-300',
    // Red/Rose (Pagos)
    'from-red-50', 'from-red-100', 'to-red-100', 'to-red-200', 'border-red-200', 'border-red-300', 'to-rose-50',
    // Orange (Utilidad negativa)
    'from-orange-50', 'from-orange-100', 'to-orange-100', 'to-orange-200', 'border-orange-200', 'border-orange-300',
    // Indigo (misc cards)
    'from-indigo-50', 'to-indigo-100', 'border-indigo-200',
  ],
  
  plugins: [],
  
  corePlugins: {
    preflight: true,
  }
}
