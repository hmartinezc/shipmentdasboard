# Script to add lq- prefix to all Tailwind classes
# This ensures no CSS conflicts when deployed to Razor Pages

$componentsPath = "c:\Users\hernyk.martinez\Downloads\shipment-dashboard\components"
$files = Get-ChildItem -Path $componentsPath -Filter "*.tsx"

Write-Host "Found $($files.Count) component files to update" -ForegroundColor Cyan
Write-Host ""

foreach ($file in $files) {
    Write-Host "Processing: $($file.Name)" -ForegroundColor Yellow
    
    $content = Get-Content -Path $file.FullName -Raw
    $originalContent = $content
    
    # Replace className=" with className="lq- (but skip if already has lq-)
    $content = $content -replace 'className="(?!lq-)', 'className="lq-'
    
    # Also handle template literals with className={` patterns
    $content = $content -replace 'className=\{\s*`(?!lq-)', 'className={`lq-'
    
    # Handle conditional classes: className={variable ? " to className={variable ? "lq-
    $content = $content -replace '(\?\s*[''"])(?!lq-)([a-z])', '$1lq-$2'
    $content = $content -replace '(\:\s*[''"])(?!lq-)([a-z])', '$1lq-$2'
    
    if ($content -ne $originalContent) {
        Set-Content -Path $file.FullName -Value $content -NoNewline
        Write-Host "  Updated" -ForegroundColor Green
    } else {
        Write-Host "  No changes needed" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Host "Done! All components updated with lq- prefix" -ForegroundColor Green
