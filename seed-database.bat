@echo off
echo ========================================
echo Seeding Smart Campus Database
echo ========================================
echo.
echo Make sure MongoDB is running!
echo.
cd backend
node seed.js
echo.
pause
