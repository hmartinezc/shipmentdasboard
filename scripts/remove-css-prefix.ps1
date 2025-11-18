# Script para QUITAR el prefijo lq- de todas las clases Tailwind
# Esto revierte los cambios para usar Tailwind v4 sin prefijo

$componentsPath = "c:\Users\hernyk.martinez\Downloads\shipment-dashboard\components"
$appFile = "c:\Users\hernyk.martinez\Downloads\shipment-dashboard\App.tsx"
$files = Get-ChildItem -Path $componentsPath -Filter "*.tsx"
$files += Get-Item $appFile

Write-Host "Quitando prefijo lq- de $($files.Count) archivos..." -ForegroundColor Cyan
Write-Host ""

foreach ($file in $files) {
    Write-Host "Procesando: $($file.Name)" -ForegroundColor Yellow
    
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # Quitar lq- de className="lq-
    $content = $content -replace 'className="lq-', 'className="'
    
    # Quitar lq- de className={`lq-
    $content = $content -replace 'className=\{\s*`lq-', 'className={`'
    
    # Quitar lq- de strings condicionales
    $content = $content -replace '([\?:]\s*[''"])lq-', '$1'
    
    # Quitar lq- de hover:lq-, focus:lq-, etc.
    $content = $content -replace '(hover|focus|active|disabled|group-hover):lq-', '$1:'
    
    # Quitar lq- de responsive: sm:lq-, md:lq-, lg:lq-
    $content = $content -replace '(sm|md|lg|xl|2xl):lq-', '$1:'
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  Actualizado" -ForegroundColor Green
    } else {
        Write-Host "  Sin cambios" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Listo! Prefijo lq- removido de todos los componentes" -ForegroundColor Green
