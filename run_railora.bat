@echo off
TITLE RAILORA - Railway Route Optimization & Budget Planning System
echo ======================================================================
echo                 RAILORA - Every journey has another way.
echo        Smart Railway Route Optimization & Budget Planning System
echo ======================================================================
echo.

cd /d "%~dp0"

echo [1/3] Checking Python Backend dependencies...
cd backend
py database.py
cd ..

echo.
echo [2/3] Launching Python Flask Backend on port 5000...
start "RAILORA Backend (Flask)" cmd /k "cd /d ""%~dp0backend"" && py app.py"

echo.
echo [3/3] Launching React Vite Frontend on port 3000...
start "RAILORA Frontend (Vite)" cmd /k "cd /d ""%~dp0frontend"" && npm run dev"

echo.
echo Waiting 3 seconds for servers to initialize...
timeout /t 3 /nobreak >nul

echo.
echo Opening RAILORA in your default web browser...
start http://localhost:3000

echo.
echo ======================================================================
echo RAILORA is now running!
echo Frontend: http://localhost:3000
echo Backend API: http://127.0.0.1:5000/api/health
echo Press any key to close this launcher window (servers will remain active).
echo ======================================================================
pause >nul
