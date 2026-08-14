
$ErrorActionPreference = "Continue"
$nodePath = "C:\Program Files\nodejs\node.exe"
$stdoutFile = Join-Path $PSScriptRoot "server-stdout.log"
$stderrFile = Join-Path $PSScriptRoot "server-stderr.log"

Write-Host "Starting server from directory: $PSScriptRoot"

# Clear old logs
if (Test-Path $stdoutFile) { Remove-Item $stdoutFile -Force }
if (Test-Path $stderrFile) { Remove-Item $stderrFile -Force }

# Change directory to the script's directory
Set-Location $PSScriptRoot

# Start the server with just "server.js"
$process = Start-Process -FilePath $nodePath -ArgumentList "server.js" -PassThru -NoNewWindow -RedirectStandardOutput $stdoutFile -RedirectStandardError $stderrFile

Write-Host "Server started with PID: $($process.Id)"

# Wait a bit for the server to start
Start-Sleep -Seconds 3

# Check if the process is still running
if ($process.HasExited) {
    Write-Host "Server exited with code: $($process.ExitCode)"
    Write-Host "`nStdout:"
    Get-Content $stdoutFile -ErrorAction SilentlyContinue
    Write-Host "`nStderr:"
    Get-Content $stderrFile -ErrorAction SilentlyContinue
} else {
    Write-Host "✅ Server is running!"
    Write-Host "📡 Health check: http://localhost:5000/health"
    Write-Host "📊 Stocks API: http://localhost:5000/api/stocks"
    Write-Host "📝 Logs at: $stdoutFile and $stderrFile"
}
