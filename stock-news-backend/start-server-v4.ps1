
$ErrorActionPreference = "Continue"
$nodePath = "C:\Program Files\nodejs\node.exe"
$serverFile = Join-Path $PSScriptRoot "server.js"
$stdoutFile = Join-Path $PSScriptRoot "server-stdout.log"
$stderrFile = Join-Path $PSScriptRoot "server-stderr.log"

Write-Host "Starting server with node: $nodePath"
Write-Host "Server file: $serverFile"

# Clear old logs
if (Test-Path $stdoutFile) { Remove-Item $stdoutFile -Force }
if (Test-Path $stderrFile) { Remove-Item $stderrFile -Force }

# Start the server with arguments as an array
$arguments = @($serverFile)
$process = Start-Process -FilePath $nodePath -ArgumentList $arguments -PassThru -NoNewWindow -RedirectStandardOutput $stdoutFile -RedirectStandardError $stderrFile -WorkingDirectory $PSScriptRoot

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
