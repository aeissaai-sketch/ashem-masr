
Write-Host "Starting stock news server on port 5001..."
$ErrorActionPreference = "Continue"
$logFile = Join-Path $PSScriptRoot "server-log.txt"
$nodePath = "C:\Program Files\nodejs\node.exe"
"=== Starting server on port 5001 at $(Get-Date) ===" | Out-File -FilePath $logFile -Append

try {
    Write-Host "Running npm install..."
    $npmPath = "C:\Program Files\nodejs\npm.cmd"
    & $npmPath install
    Write-Host "npm install done."

    Write-Host "Starting server..."
    $process = Start-Process -FilePath $nodePath -ArgumentList "server.js" -NoNewWindow -PassThru
    Write-Host "Server started with PID: $($process.Id)"

    # Wait a bit to check if it's running
    Start-Sleep -Seconds 3
    if (-not $process.HasExited) {
        Write-Host "Server is running successfully on http://localhost:5001"
        Write-Host "Health check: http://localhost:5001/health"
        Write-Host "API endpoint: http://localhost:5001/api/stocks"
    } else {
        Write-Host "Server exited immediately with code: $($process.ExitCode)"
    }

} catch {
    Write-Host "Error: $($_.Exception.Message)"
}
