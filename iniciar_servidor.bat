@echo off
title Servidor Web SG-SST Propiedad Horizontal
echo ==============================================================
echo INICIANDO PLATAFORMA DE ASESORIA SG-SST - PROPIEDAD HORIZONTAL
echo ==============================================================
echo.
echo Verificando entorno de Python...
python -c "import sqlite3; print('Entorno Python OK')"
if %errorlevel% neq 0 (
    echo Error: Python no se encuentra en el PATH.
    pause
    exit /b
)

echo.
echo Iniciando Servidor Web y Base de Datos SQLite en el puerto 8080...
echo.
echo Abre tu navegador en: http://localhost:8080
echo.
start http://localhost:8080
python server.py
pause

