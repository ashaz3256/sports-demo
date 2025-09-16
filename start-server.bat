@echo off
echo Starting Lumara Sports Dashboard Server...
echo.
echo Server will be available at: http://localhost:8000
echo Press Ctrl+C to stop the server
echo.
http-server -p 8000 -o
pause
