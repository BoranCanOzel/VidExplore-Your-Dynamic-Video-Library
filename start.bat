@echo off
setlocal

REM Start the PHP built-in server
start /b php -S 0.0.0.0:8000
if errorlevel 1 (
    echo "Error: PHP server could not be started."
    exit /b 1
)

REM Wait a few seconds to ensure the server starts
timeout /t 3 /nobreak >nul

REM Get the local IP address
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /R /C:"IPv4 Address"') do set ip=%%i

REM Remove any leading spaces from the IP address
set ip=%ip:~0%

REM Echo the link to access the server from your phone
echo Use this link to access the server from your phone: http://%ip%:8000

REM Open Chrome to the local server
start chrome "http://localhost:8000"

endlocal
