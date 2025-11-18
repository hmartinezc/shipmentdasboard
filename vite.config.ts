import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import preact from '@preact/preset-vite';

export default defineConfig(({ mode }) => {
    // Modo development: app completa
    // Modo production: bundle para Razor Pages
  const isProduction = mode === 'production';
  const env = loadEnv(mode, process.cwd(), '');
  const unminified = env.UNMINIFIED === 'true';
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [preact()],
      define: {
        // Definir process.env.NODE_ENV para React
        'process.env.NODE_ENV': JSON.stringify(isProduction ? 'production' : 'development')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: isProduction ? {
        outDir: 'dist-razor',
        emptyOutDir: true,
        lib: {
          entry: path.resolve(__dirname, 'liquidation-web-component.tsx'), // Web Component entry
          name: 'LiquidationApp',
          formats: ['iife'],
          fileName: () => 'liquidation-bundle.js'
        },
        rollupOptions: {
          external: [],
          output: {
            globals: {},
            // ✅ OPTIMIZACIÓN: Mangling de nombres para reducir tamaño
            manualChunks: undefined,
            assetFileNames: (assetInfo) => {
              if (assetInfo.name && assetInfo.name.endsWith('.css')) {
                return 'liquidation-styles.css';
              }
              return assetInfo.name || 'asset';
            },
            // ✅ OPTIMIZACIÓN: Eliminar comentarios y optimizar código
            compact: true,
          },
          // ✅ OPTIMIZACIÓN: Tree-shaking controlado (no eliminar efectos secundarios de preact)
          treeshake: {
            moduleSideEffects: (id) => {
              // Preservar side effects de preact y sus módulos
              return id.includes('preact') || id.includes('node_modules');
            },
            propertyReadSideEffects: false,
            tryCatchDeoptimization: false
          }
        },
        cssCodeSplit: false,
        // ✅ Minificación controlable por variable de entorno UNMINIFIED
        minify: unminified ? false : 'terser',
        terserOptions: {
          compress: {
            drop_console: true,
            drop_debugger: true,
            pure_funcs: ['console.log', 'console.info', 'console.debug'],
            passes: 2, // Múltiples pasadas de optimización
            unsafe_arrows: true,
            unsafe_methods: true,
            unsafe_proto: true
          },
          mangle: {
            safari10: true,
            properties: {
              regex: /^_/ // Mangle propiedades privadas
            }
          },
          format: {
            comments: false,
            ecma: 2020
          }
        },
        // ✅ OPTIMIZACIÓN: Reportar tamaño del bundle
        reportCompressedSize: true,
        chunkSizeWarningLimit: 500,
        // ✅ Sin sourcemap para entregar un único archivo .js
        sourcemap: false
      } : undefined
    };
});
