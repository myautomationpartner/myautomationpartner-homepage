@echo off
REM GitHub + Cloudflare Pages Setup Script (Windows Batch)
REM Right-click Run as Administrator

setlocal enabledelayedexpansion

set "workspace=C:\Users\kenny\OneDrive\Documents\Claude CoWork\My Automation Partner"
set "temp_folder=%TEMP%\github-deploy"

echo.
echo ========================================
echo   GitHub Repo Setup for My Automation Partner
echo ========================================
echo.

REM Create temp folder
if exist "%temp_folder%" rmdir /s /q "%temp_folder%"
mkdir "%temp_folder%"

REM ====== REPO 1: Homepage ======
echo.
echo [1/2] Setting up myautomationpartner-homepage...
echo.

set "repo1=%temp_folder%\myautomationpartner-homepage"
mkdir "%repo1%"
cd /d "%repo1%"

REM Copy homepage and rename to index.html
copy "%workspace%\homepage.html" "%repo1%\index.html" >nul

REM Initialize git repo
git init
git config user.email "billing@myautomationpartner.com"
git config user.name "My Automation Partner"
git add index.html
git commit -m "Initial homepage deployment"
git remote add origin https://github.com/myautomationpartner/myautomationpartner-homepage.git
git branch -M main

echo [OK] Homepage repository created at: %repo1%
echo.

REM ====== REPO 2: Dancescapes ======
echo.
echo [2/2] Setting up dancescapes-portal...
echo.

set "repo2=%temp_folder%\dancescapes-portal"
mkdir "%repo2%"
cd /d "%repo2%"

REM Copy dancescapes and rename to index.html
copy "%workspace%\dancescapes-portal.html" "%repo2%\index.html" >nul

REM Initialize git repo
git init
git config user.email "billing@myautomationpartner.com"
git config user.name "My Automation Partner"
git add index.html
git commit -m "Initial dancescapes portal deployment"
git remote add origin https://github.com/myautomationpartner/dancescapes-portal.git
git branch -M main

echo [OK] Dancescapes repository created at: %repo2%
echo.

REM ====== Display next steps ======
echo.
echo ========================================
echo   NEXT STEPS - COPY AND PASTE THESE
echo ========================================
echo.
echo [STEP 1] Push Homepage to GitHub:
echo.
echo cd "%repo1%"
echo git push -u origin main
echo.
echo [STEP 2] Push Dancescapes to GitHub:
echo.
echo cd "%repo2%"
echo git push -u origin main
echo.
echo [STEP 3] After pushing, go to:
echo https://dash.cloudflare.com
echo Go to: Workers ^& Pages ^> Create ^> Pages ^> Connect to Git
echo.
echo ========================================
echo.

pause
