@echo off
:: Project Tracker - Startup Script
:: This script starts the Project Tracker server via PM2

cd /d "%~dp0"
pm2 resurrect
