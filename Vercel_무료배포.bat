@echo off
chcp 65001 > nul
title 한양도시락 Vercel (.app) 무료 웹 배포
echo ========================================================
echo   한양도시락을 Vercel(vercel.app)에 무료 웹 배포합니다.
echo   https://hanyang-dosirak-xxxx.vercel.app 주소가 생성됩니다.
echo ========================================================
echo.

cd /d "%~dp0"
call npx vercel --prod
pause
