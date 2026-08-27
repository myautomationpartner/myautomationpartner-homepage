# GitHub + Cloudflare Pages Setup Script
# Run this in PowerShell from the workspace folder

$workspaceFolder = "C:\Users\kenny\OneDrive\Documents\Claude CoWork\My Automation Partner"
$tempFolder = "$env:TEMP\github-deploy"

# Create temp folder
if (Test-Path $tempFolder) { Remove-Item -Recurse -Force $tempFolder }
New-Item -ItemType Directory -Path $tempFolder | Out-Null

Write-Host "Workspace: $workspaceFolder" -ForegroundColor Cyan
Write-Host "Temp folder: $tempFolder" -ForegroundColor Cyan
Write-Host ""

# ====== REPO 1: Homepage ======
Write-Host "Setting up myautomationpartner-homepage..." -ForegroundColor Green

$repo1 = "$tempFolder\myautomationpartner-homepage"
New-Item -ItemType Directory -Path $repo1 | Out-Null
cd $repo1

# Copy homepage
Copy-Item "$workspaceFolder\homepage.html" "$repo1\index.html"

# Initialize git
git init
git config user.email "billing@myautomationpartner.com"
git config user.name "My Automation Partner"
git add index.html
git commit -m "Initial homepage deployment"
git remote add origin https://github.com/myautomationpartner/myautomationpartner-homepage.git
git branch -M main

Write-Host "OK - Homepage repo ready" -ForegroundColor Yellow
Write-Host ""

# ====== REPO 2: Dancescapes ======
Write-Host "Setting up dancescapes-portal..." -ForegroundColor Green

$repo2 = "$tempFolder\dancescapes-portal"
New-Item -ItemType Directory -Path $repo2 | Out-Null
cd $repo2

# Copy dancescapes
Copy-Item "$workspaceFolder\dancescapes-portal.html" "$repo2\index.html"

# Initialize git
git init
git config user.email "billing@myautomationpartner.com"
git config user.name "My Automation Partner"
git add index.html
git commit -m "Initial dancescapes portal deployment"
git remote add origin https://github.com/myautomationpartner/dancescapes-portal.git
git branch -M main

Write-Host "OK - Dancescapes repo ready" -ForegroundColor Yellow
Write-Host ""

# ====== PUSH COMMANDS ======
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "NEXT STEPS - Copy and paste these commands:" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "# Push Homepage" -ForegroundColor Yellow
Write-Host "cd '$repo1'" -ForegroundColor White
Write-Host "git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "# Push Dancescapes" -ForegroundColor Yellow
Write-Host "cd '$repo2'" -ForegroundColor White
Write-Host "git push -u origin main" -ForegroundColor White
Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "After pushing, go to Cloudflare:" -ForegroundColor Green
Write-Host "https://dash.cloudflare.com" -ForegroundColor Green
Write-Host "Workers & Pages > Create > Pages > Connect to Git" -ForegroundColor Green
Write-Host ""
