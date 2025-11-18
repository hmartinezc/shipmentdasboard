# Script de Validacion Automatica - Liquidacion Dashboard
# Verifica que todos los componentes esten listos para produccion

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Validacion Automatica - Dashboard" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$errores = 0
$advertencias = 0

# Funcion helper para checks
function Check-Item {
    param(
        [string]$nombre,
        [bool]$condicion,
        [string]$mensaje,
        [bool]$esAdvertencia = $false
    )
    
    if ($condicion) {
        Write-Host "[OK] $nombre" -ForegroundColor Green
        Write-Host "    $mensaje" -ForegroundColor Gray
    } else {
        if ($esAdvertencia) {
            Write-Host "[!] $nombre" -ForegroundColor Yellow
            Write-Host "    $mensaje" -ForegroundColor Yellow
            $script:advertencias++
        } else {
            Write-Host "[X] $nombre" -ForegroundColor Red
            Write-Host "    $mensaje" -ForegroundColor Red
            $script:errores++
        }
    }
}

Write-Host "1. VERIFICANDO ARCHIVOS DE BUILD..." -ForegroundColor Cyan
Write-Host ""

# Verificar archivos de build
$bundleExists = Test-Path "dist-razor\liquidation-bundle.js"
Check-Item "Bundle JS" $bundleExists `
    $(if ($bundleExists) { "liquidation-bundle.js encontrado" } else { "FALTA liquidation-bundle.js - ejecuta: npm run build:razor" })

$cssExists = Test-Path "dist-razor\liquidation-styles.css"
Check-Item "CSS Styles" $cssExists `
    $(if ($cssExists) { "liquidation-styles.css encontrado" } else { "FALTA liquidation-styles.css - ejecuta: npm run build:razor" })

$testExists = Test-Path "dist-razor\test.html"
Check-Item "Test HTML" $testExists `
    $(if ($testExists) { "test.html disponible para pruebas" } else { "FALTA test.html" })

Write-Host ""

# Verificar tamaños de archivos
if ($bundleExists) {
    $bundleSize = (Get-Item "dist-razor\liquidation-bundle.js").Length / 1KB
    $sizeOk = $bundleSize -gt 500 -and $bundleSize -lt 700
    Check-Item "Tamaño Bundle" $sizeOk `
        $(if ($sizeOk) { "~$([math]::Round($bundleSize, 2)) KB (dentro del rango esperado)" } else { "Tamaño inusual: $([math]::Round($bundleSize, 2)) KB" })
}

if ($cssExists) {
    $cssSize = (Get-Item "dist-razor\liquidation-styles.css").Length / 1KB
    $cssOk = $cssSize -gt 30 -and $cssSize -lt 60
    Check-Item "Tamaño CSS" $cssOk `
        $(if ($cssOk) { "~$([math]::Round($cssSize, 2)) KB (dentro del rango esperado)" } else { "Tamaño inusual: $([math]::Round($cssSize, 2)) KB" })
}

Write-Host ""
Write-Host "2. VERIFICANDO ARCHIVOS DE DOCUMENTACIÓN..." -ForegroundColor Cyan
Write-Host ""

$analisisExists = Test-Path "ANALISIS-COMPLETO.md"
Check-Item "Análisis Completo" $analisisExists `
    "Documentación técnica detallada" $true

$validacionExists = Test-Path "VALIDACION-RAPIDA.md"
Check-Item "Validación Rápida" $validacionExists `
    "Checklist de validación" $true

$integrationExists = Test-Path "INTEGRATION.md"
Check-Item "Guía de Integración" $integrationExists `
    "Instrucciones para Razor Pages" $true

$resumenExists = Test-Path "RESUMEN-EJECUTIVO.md"
Check-Item "Resumen Ejecutivo" $resumenExists `
    "Resumen ejecutivo del proyecto" $true

Write-Host ""
Write-Host "3. VERIFICANDO ARCHIVOS DE PROYECTO..." -ForegroundColor Cyan
Write-Host ""

$packageExists = Test-Path "package.json"
Check-Item "package.json" $packageExists `
    "Configuración de dependencias"

$viteConfigExists = Test-Path "vite.config.ts"
Check-Item "vite.config.ts" $viteConfigExists `
    "Configuración de Vite para build"

$mainModalExists = Test-Path "main-modal.tsx"
Check-Item "main-modal.tsx" $mainModalExists `
    "Entry point del componente modal"

$appExists = Test-Path "App.tsx"
Check-Item "App.tsx" $appExists `
    "Componente principal"

Write-Host ""
Write-Host "4. VERIFICANDO SCRIPT DE DEPLOY..." -ForegroundColor Cyan
Write-Host ""

$deployExists = Test-Path "deploy-to-razor.ps1"
Check-Item "Script Deploy" $deployExists `
    "Script de deploy automatizado disponible" $true

Write-Host ""
Write-Host "5. VERIFICANDO CONTENIDO DEL BUNDLE..." -ForegroundColor Cyan
Write-Host ""

if ($bundleExists) {
    $bundleContent = Get-Content "dist-razor\liquidation-bundle.js" -Raw
    
    $hasLiquidationApp = $bundleContent -match "LiquidationApp"
    Check-Item "API Global" $hasLiquidationApp `
        $(if ($hasLiquidationApp) { "window.LiquidationApp expuesta correctamente" } else { "NO se encontró LiquidationApp en el bundle" })
    
    $hasReact = $bundleContent -match "react"
    Check-Item "React Incluido" $hasReact `
        $(if ($hasReact) { "React incluido en el bundle" } else { "React no detectado en el bundle" }) $true
}

Write-Host ""
Write-Host "6. VERIFICANDO TEST HTML..." -ForegroundColor Cyan
Write-Host ""

if ($testExists) {
    $testContent = Get-Content "dist-razor\test.html" -Raw
    
    $hasFontAwesome = $testContent -match "font-awesome"
    Check-Item "Font Awesome CDN" $hasFontAwesome `
        $(if ($hasFontAwesome) { "CDN de Font Awesome incluido" } else { "Falta Font Awesome CDN" })
    
    $hasBundle = $testContent -match "liquidation-bundle"
    Check-Item "Referencia Bundle" $hasBundle `
        $(if ($hasBundle) { "Bundle referenciado en test.html" } else { "Bundle no referenciado en test.html" })
    
    $hasCallbacks = $testContent -match "abrirSingle|abrirMultiple"
    Check-Item "Funciones Test" $hasCallbacks `
        $(if ($hasCallbacks) { "Funciones de prueba implementadas" } else { "Funciones de prueba no encontradas" })
}

Write-Host ""
Write-Host "7. VERIFICANDO NODE_MODULES..." -ForegroundColor Cyan
Write-Host ""

$nodeModulesExists = Test-Path "node_modules"
Check-Item "Dependencias" $nodeModulesExists `
    $(if ($nodeModulesExists) { "node_modules instalado correctamente" } else { "Ejecuta: npm install" })

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  RESUMEN DE VALIDACIÓN" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($errores -eq 0 -and $advertencias -eq 0) {
    Write-Host "VALIDACION EXITOSA" -ForegroundColor Green
    Write-Host "Todos los componentes estan listos para produccion" -ForegroundColor Green
    Write-Host ""
    Write-Host "Proximos pasos:" -ForegroundColor Cyan
    Write-Host "  1. Probar standalone:" -ForegroundColor White
    Write-Host "     npx http-server -p 8080" -ForegroundColor Gray
    Write-Host "     Abrir: http://localhost:8080/dist-razor/test.html" -ForegroundColor Gray
    Write-Host ""
    Write-Host "  2. Deploy a Razor:" -ForegroundColor White
    Write-Host "     .\deploy-to-razor.ps1 -TargetPath 'C:\TuApp\wwwroot'" -ForegroundColor Gray
    Write-Host ""
} elseif ($errores -eq 0) {
    Write-Host "VALIDACION CON ADVERTENCIAS" -ForegroundColor Yellow
    Write-Host "Advertencias: $advertencias" -ForegroundColor Yellow
    Write-Host "El proyecto es funcional pero revisa las advertencias" -ForegroundColor Yellow
} else {
    Write-Host "VALIDACION FALLIDA" -ForegroundColor Red
    Write-Host "Errores: $errores" -ForegroundColor Red
    Write-Host "Advertencias: $advertencias" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Ejecuta los siguientes comandos:" -ForegroundColor Yellow
    Write-Host "  1. npm install" -ForegroundColor White
    Write-Host "  2. npm run build:razor" -ForegroundColor White
    Write-Host "  3. .\validar.ps1 (ejecutar este script nuevamente)" -ForegroundColor White
}

Write-Host ""
Write-Host "Documentacion disponible:" -ForegroundColor Cyan
Write-Host "  - RESUMEN-EJECUTIVO.md (resumen rapido)" -ForegroundColor Gray
Write-Host "  - VALIDACION-RAPIDA.md (checklist)" -ForegroundColor Gray
Write-Host "  - ANALISIS-COMPLETO.md (analisis tecnico)" -ForegroundColor Gray
Write-Host "  - INTEGRATION.md (guia de integracion)" -ForegroundColor Gray
Write-Host ""

exit $errores
