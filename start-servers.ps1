
Write-Host "Starting servers..." -ForegroundColor Green

$nodePath = "C:\Program Files\nodejs\node.exe"

# Start stock news backend
Write-Host "Starting stock news backend on port 5000..." -ForegroundColor Cyan
Start-Process -FilePath $nodePath -ArgumentList "server.js" -WorkingDirectory "g:\My Drive\ashem masr\stock-news-backend" -WindowStyle Normal

# Wait a second
Start-Sleep -Seconds 2

# Start static server for frontend
Write-Host "Starting static file server on port 3000..." -ForegroundColor Cyan
# First we need to install express in root dir?
$rootDir = "g:\My Drive\ashem masr"
if (-not (Test-Path (Join-Path $rootDir "node_modules\express"))) {
    Write-Host "Installing express..."
    Set-Location $rootDir
    & $nodePath (Join-Path $rootDir "node_modules\npm\bin\npm-cli.js") install express
}

Start-Process -FilePath $nodePath -ArgumentList "static-server.js" -WorkingDirectory $rootDir -WindowStyle Normal

Write-Host "Servers should now be running!" -ForegroundColor Green
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Yellow
Write-Host "Backend: http://localhost:5000" -ForegroundColor Yellow
Start-Sleep -Seconds 3
