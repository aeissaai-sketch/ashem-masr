@echo off
title Starting Stock Analysis Servers

echo.
echo ==============================================
echo   Starting Stock Analysis Application
echo ==============================================
echo.

echo [1/2] Starting Stock News Backend (port 5000)...
cd /d "g:\My Drive\ashem masr\stock-news-backend"
start "Stock News Backend" cmd /k ""C:\Program Files\nodejs\node.exe" server.js"

timeout /t 3 /nobreak >nul

echo [2/2] Starting Frontend Static Server (port 3000)...
cd /d "g:\My Drive\ashem masr"
if not exist "node_modules\express" (
    echo First time setup: Installing express...
    call "C:\Program Files\nodejs\npm.cmd" install express
)
start "Frontend Server" cmd /k ""C:\Program Files\nodejs\node.exe" static-server.js"

echo.
echo ==============================================
echo   Success: All servers are starting!
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo ==============================================
echo.
echo Press any key to close this window...
pause >nul
