# Script para desplegar React bundle a aplicación ASP.NET Razor Pages
# 
# USO: 
# .\deploy-to-razor.ps1 -TargetPath "C:\Path\To\Your\RazorApp\wwwroot"
# 
# O editar la variable $defaultTarget abajo y ejecutar sin parámetros

param(
    [string]$TargetPath = ""
)

# CONFIGURACIÓN: Actualiza esta ruta a tu proyecto Razor Pages
$defaultTarget = "C:\Projects\MiAppRazor\wwwroot"

# Usar parámetro o default
$wwwroot = if ($TargetPath) { $TargetPath } else { $defaultTarget }

# Validar que existe la carpeta de destino
if (-not (Test-Path $wwwroot)) {
    Write-Host "ERROR: No existe la carpeta de destino: $wwwroot" -ForegroundColor Red
    Write-Host "Por favor actualiza la variable `$defaultTarget en el script o usa el parámetro -TargetPath" -ForegroundColor Yellow
    exit 1
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Liquidación Dashboard - Deploy Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Paso 1: Build (JS único con CSS embebido)
Write-Host "[1/2] Compilando bundle de producción (single-file)..." -ForegroundColor Yellow
npm run build:single

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Build falló" -ForegroundColor Red
    exit 1
}

Write-Host "Build exitoso" -ForegroundColor Green
Write-Host ""

# Paso 2: Crear carpetas de destino si no existen
$jsTarget = Join-Path $wwwroot "js"

Write-Host "[2/2] Verificando carpetas de destino..." -ForegroundColor Yellow

if (-not (Test-Path $jsTarget)) {
    New-Item -ItemType Directory -Path $jsTarget | Out-Null
    Write-Host "Creada carpeta: $jsTarget" -ForegroundColor Green
}

# Copiar archivo JS único
Write-Host "Copiando archivo..." -ForegroundColor Yellow

$sourceJs = "dist-razor\liquidation-bundle.js"
$destJs = Join-Path $jsTarget "liquidation-bundle.js"

Copy-Item -Path $sourceJs -Destination $destJs -Force

Write-Host "Copiado: $sourceJs -> $destJs" -ForegroundColor Green

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Deploy completado exitosamente!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Archivos desplegados en:" -ForegroundColor White
Write-Host "  JavaScript: $destJs" -ForegroundColor Gray
Write-Host ""
Write-Host "SIGUIENTE PASO: Agregar en tu archivo Razor (.cshtml):" -ForegroundColor Yellow
Write-Host ""
Write-Host "  <!-- No se requiere CSS externo; estilos van embebidos -->" -ForegroundColor Gray
Write-Host "  <!-- Antes del </body> -->" -ForegroundColor Gray
Write-Host "  <script src=`"~/js/liquidation-bundle.js`" asp-append-version=`"true`"></script>" -ForegroundColor White
Write-Host ""
Write-Host "  <!-- Para abrir el modal -->" -ForegroundColor Gray
Write-Host "  <script>" -ForegroundColor White
Write-Host "    function abrirLiquidacion(guias) {" -ForegroundColor White
Write-Host "      window.LiquidationApp.open({" -ForegroundColor White
Write-Host "        shipments: guias," -ForegroundColor White
Write-Host "        mode: guias.length > 1 ? 'multiple' : 'single'," -ForegroundColor White
Write-Host "        onSave: () => {" -ForegroundColor White
Write-Host "          // Enviar a servidor via AJAX" -ForegroundColor White
Write-Host "          console.log('Guardar liquidación');" -ForegroundColor White
Write-Host "        }," -ForegroundColor White
Write-Host "        onCancel: () => window.LiquidationApp.close()" -ForegroundColor White
Write-Host "      });" -ForegroundColor White
Write-Host "    }" -ForegroundColor White
Write-Host "  </script>" -ForegroundColor White
Write-Host ""
