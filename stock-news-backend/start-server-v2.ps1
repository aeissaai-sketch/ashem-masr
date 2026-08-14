
$ErrorActionPreference = "Continue"
$nodePath = "C:\Program Files\nodejs\node.exe"
$serverFile = Join-Path $PSScriptRoot "server.js"
$stdoutFile = Join-Path $PSScriptRoot "server-stdout.log"
$stderrFile = Join-Path $PSScriptRoot "server-stderr.log"

Write-Host "Starting server with node: $nodePath"
Write-Host "Server file: $serverFile"

# Start the server
$process = Start-Process -FilePath $nodePath -ArgumentList $serverFile -PassThru -NoNewWindow -RedirectStandardOutput $stdoutFile -RedirectStandardError $stderrFile

Write-Host "Server started with PID: $($process.Id)"

# Wait a bit for the server to start
Start-Sleep -Seconds 3

# Check if the process is still running
if ($process.HasExited) {
    Write-Host "Server exited with code: $($process.ExitCode)"
    Write-Host "Stdout:"
    Get-Content $stdoutFile -ErrorAction SilentlyContinue
    Write-Host "Stderr:"
    Get-Content $stderrFile -ErrorAction SilentlyContinue
} else {
    Write-Host "Server is running!"
    Write-Host "Check $stdoutFile for output"
}
