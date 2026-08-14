
Write-Host "Starting server with full node path..."
$ErrorActionPreference = "Continue"
$logFile = Join-Path $PSScriptRoot "server-log.txt"
$nodePath = "C:\Program Files\nodejs\node.exe"
"=== Server started at $(Get-Date) (full path) ===" | Out-File -FilePath $logFile -Append
"Using node at: $nodePath" | Out-File -FilePath $logFile -Append

try {
    # First check if node works
    & $nodePath -v 2>&1 | Out-File -FilePath $logFile -Append
    "npm install..." | Out-File -FilePath $logFile -Append
    $npmPath = "C:\Program Files\nodejs\npm.cmd"
    & $npmPath install 2>&1 | Out-File -FilePath $logFile -Append
    
    # Now run the server in the background
    "Starting server..." | Out-File -FilePath $logFile -Append
    $process = Start-Process -FilePath $nodePath -ArgumentList "server.js" -NoNewWindow -PassThru -RedirectStandardOutput (Join-Path $PSScriptRoot "stdout.txt") -RedirectStandardError (Join-Path $PSScriptRoot "stderr.txt")
    "Server process ID: $($process.Id)" | Out-File -FilePath $logFile -Append
    Start-Sleep -Seconds 2
    if ($process.HasExited) {
        "Server exited immediately! Exit code: $($process.ExitCode)" | Out-File -FilePath $logFile -Append
        Get-Content (Join-Path $PSScriptRoot "stdout.txt") -ErrorAction SilentlyContinue | Out-File -FilePath $logFile -Append
        Get-Content (Join-Path $PSScriptRoot "stderr.txt") -ErrorAction SilentlyContinue | Out-File -FilePath $logFile -Append
    } else {
        "Server is running!" | Out-File -FilePath $logFile -Append
    }
} catch {
    "Error: $($_.Exception.Message)" | Out-File -FilePath $logFile -Append
    Write-Host "Error: $($_.Exception.Message)"
}
