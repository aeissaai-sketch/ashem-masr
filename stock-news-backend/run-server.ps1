
Write-Host "Starting server script..."
$ErrorActionPreference = "Continue"
$logFile = Join-Path $PSScriptRoot "server-log.txt"
"=== Server started at $(Get-Date) ===" | Out-File -FilePath $logFile -Append

try {
    $nodePath = Get-Command node -ErrorAction SilentlyContinue
    if ($nodePath) {
        "Node found at: $($nodePath.Source)" | Out-File -FilePath $logFile -Append
        & node server.js 2>&1 | Out-File -FilePath $logFile -Append
    } else {
        "Node not found in PATH" | Out-File -FilePath $logFile -Append
        Write-Host "Node.js not found!"
    }
} catch {
    "Error: $($_.Exception.Message)" | Out-File -FilePath $logFile -Append
    Write-Host "Error: $($_.Exception.Message)"
}
