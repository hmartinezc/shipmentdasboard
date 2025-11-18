# ========================================
# VALIDACIÓN FINAL DEL PROYECTO
# ========================================

Write-Host "🔍 Validando proyecto Liquidation Dashboard..." -ForegroundColor Cyan
Write-Host ""

$ErrorCount = 0
$WarningCount = 0

# 1. Verificar archivos de producción
Write-Host "📦 Verificando archivos de producción..." -ForegroundColor Yellow

$distFiles = @(
    "dist-razor\liquidation-bundle.js",
    "dist-razor\liquidation-styles.css",
    "dist-razor\test.html"
)

foreach ($file in $distFiles) {
    if (Test-Path $file) {
        $size = (Get-Item $file).Length / 1KB
        Write-Host "  ✅ $file ($([math]::Round($size, 2)) KB)" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file NO ENCONTRADO" -ForegroundColor Red
        $ErrorCount++
    }
}

Write-Host ""

# 2. Verificar configuración de Tailwind
Write-Host "🎨 Verificando configuración de Tailwind..." -ForegroundColor Yellow

$tailwindConfig = Get-Content "tailwind.config.js" -Raw

if ($tailwindConfig -match "prefix:\s*'lq-'") {
    Write-Host "  ⚠️  ADVERTENCIA: Prefijo 'lq-' encontrado (debería estar eliminado)" -ForegroundColor Yellow
    $WarningCount++
} else {
    Write-Host "  ✅ Configuración sin prefijos (correcto)" -ForegroundColor Green
}

Write-Host ""

# 3. Verificar test.html
Write-Host "🧪 Verificando test.html..." -ForegroundColor Yellow

$testHtml = Get-Content "dist-razor\test.html" -Raw

# Verificar que NO tenga Tailwind CDN
if ($testHtml -match "cdn.tailwindcss.com") {
    Write-Host "  ❌ ERROR: test.html incluye Tailwind CDN (debe eliminarse)" -ForegroundColor Red
    $ErrorCount++
} else {
    Write-Host "  ✅ Sin Tailwind CDN (correcto)" -ForegroundColor Green
}

# Verificar rutas relativas
if ($testHtml -match 'src="/dist-razor/') {
    Write-Host "  ❌ ERROR: test.html usa rutas absolutas (debe usar relativas)" -ForegroundColor Red
    $ErrorCount++
} else {
    Write-Host "  ✅ Rutas relativas (correcto)" -ForegroundColor Green
}

# Verificar que incluya liquidation-styles.css
if ($testHtml -match "liquidation-styles.css") {
    Write-Host "  ✅ Incluye liquidation-styles.css" -ForegroundColor Green
} else {
    Write-Host "  ❌ ERROR: No incluye liquidation-styles.css" -ForegroundColor Red
    $ErrorCount++
}

Write-Host ""

# 4. Verificar estructura de carpetas
Write-Host "📁 Verificando estructura del proyecto..." -ForegroundColor Yellow

$requiredFolders = @(
    "components",
    "hooks",
    "services",
    "utils",
    "data",
    "dist-razor",
    "docs",
    "scripts"
)

foreach ($folder in $requiredFolders) {
    if (Test-Path $folder) {
        Write-Host "  ✅ $folder/" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $folder/ NO ENCONTRADA" -ForegroundColor Red
        $ErrorCount++
    }
}

Write-Host ""

# 5. Verificar archivos de documentación
Write-Host "📚 Verificando documentación..." -ForegroundColor Yellow

$docs = @(
    "README.md",
    "DEPLOYMENT.md",
    "CHANGELOG.md"
)

foreach ($doc in $docs) {
    if (Test-Path $doc) {
        Write-Host "  ✅ $doc" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $doc NO ENCONTRADO" -ForegroundColor Red
        $ErrorCount++
    }
}

Write-Host ""

# 6. Verificar package.json scripts
Write-Host "📜 Verificando scripts npm..." -ForegroundColor Yellow

$packageJson = Get-Content "package.json" | ConvertFrom-Json

$requiredScripts = @("dev", "build", "build:razor", "preview")

foreach ($script in $requiredScripts) {
    if ($packageJson.scripts.$script) {
        Write-Host "  ✅ npm run $script" -ForegroundColor Green
    } else {
        Write-Host "  ❌ npm run $script NO ENCONTRADO" -ForegroundColor Red
        $ErrorCount++
    }
}

Write-Host ""

# 7. Tamaño del bundle
Write-Host "💾 Análisis de tamaño del bundle..." -ForegroundColor Yellow

$jsSize = (Get-Item "dist-razor\liquidation-bundle.js").Length / 1KB
$cssSize = (Get-Item "dist-razor\liquidation-styles.css").Length / 1KB

Write-Host "  📦 JS Bundle: $([math]::Round($jsSize, 2)) KB" -ForegroundColor Cyan
Write-Host "  🎨 CSS Bundle: $([math]::Round($cssSize, 2)) KB" -ForegroundColor Cyan

if ($jsSize -gt 500) {
    Write-Host "  ⚠️  ADVERTENCIA: Bundle JS mayor a 500 KB" -ForegroundColor Yellow
    $WarningCount++
}

Write-Host ""

# ========================================
# RESUMEN FINAL
# ========================================

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "           RESUMEN DE VALIDACIÓN        " -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if ($ErrorCount -eq 0 -and $WarningCount -eq 0) {
    Write-Host "🎉 ¡TODO PERFECTO! Proyecto listo para producción" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos pasos:" -ForegroundColor Cyan
    Write-Host "  1. Abre dist-razor/test.html para probar" -ForegroundColor White
    Write-Host "  2. Lee DEPLOYMENT.md para integrar en ASP.NET" -ForegroundColor White
    Write-Host "  3. Copia archivos de dist-razor/ a tu proyecto" -ForegroundColor White
} elseif ($ErrorCount -eq 0) {
    Write-Host "⚠️  $WarningCount advertencia(s) encontrada(s)" -ForegroundColor Yellow
    Write-Host "El proyecto funciona pero revisa las advertencias arriba" -ForegroundColor Yellow
} else {
    Write-Host "❌ $ErrorCount error(es) encontrado(s)" -ForegroundColor Red
    Write-Host "⚠️  $WarningCount advertencia(s) encontrada(s)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Por favor corrige los errores antes de continuar" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
