@echo off
chcp 65001 > nul
title 한양도시락 GitHub 전송 및 Vercel 자동 배포
echo ========================================================
echo   한양도시락을 GitHub(yoocomdr53-svg)에 전송합니다...
echo   https://github.com/yoocomdr53-svg/hanyang-dosirak
echo ========================================================
echo.

cd /d "%~dp0"
git push -u origin main
echo.
if %ERRORLEVEL% equ 0 (
    echo ========================================================
    echo  [성공] 깃허브 전송이 완료되었습니다!
    echo  성경웹처럼 Vercel에서 자동으로 https://hanyang-dosirak.vercel.app 로 배포됩니다.
    echo ========================================================
) else (
    echo --------------------------------------------------------
    echo  [안내] 혹시 깃허브에 'hanyang-dosirak' 레포지토리가 아직 없으시다면:
    echo  1. https://github.com/new 접속
    echo  2. Repository name에 hanyang-dosirak 입력 후 [Create repository] 클릭
    echo  3. 그 다음 이 배치파일을 다시 실행해 주시면 즉시 전송됩니다.
    echo --------------------------------------------------------
)
pause
