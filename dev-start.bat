@echo off
echo ========================================
echo Smart Campus Platform - Development Mode
echo ========================================
echo.
echo This will start both backend and frontend in development mode
echo.
echo Starting Backend Server with auto-reload...
start cmd /k "cd backend && npm run dev"
timeout /t 3 /nobreak > nul

echo Starting Frontend...
start cmd /k "cd frontend && npm start"

echo.
echo ========================================
echo Both servers are starting...
echo ========================================
echo Backend: http://localhost:5000
echo Frontend: http://localhost:3000
echo.
echo Press any key to stop all servers...
pause > nul

echo.
echo Stopping servers...
taskkill /FI "WINDOWTITLE eq *backend*" /F
taskkill /FI "WINDOWTITLE eq *frontend*" /F
echo Done!
