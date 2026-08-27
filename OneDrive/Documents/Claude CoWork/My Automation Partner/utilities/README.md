# Utilities & Support Scripts

**Purpose:** Helper scripts and setup tools for development and deployment

## Scripts

### `work-summary.js`
- **Purpose:** Generates work summaries and progress reports
- **Usage:** `node work-summary.js`
- **Output:** Console summary or file export

### `github-setup.bat` (Windows)
- **Purpose:** Automated GitHub repository setup for Windows
- **Usage:** Run from Command Prompt: `github-setup.bat`
- **Function:** Initializes git, configures remotes, sets up branches

### `github-setup.ps1` (PowerShell)
- **Purpose:** Automated GitHub repository setup for PowerShell
- **Usage:** Run in PowerShell: `.\github-setup.ps1`
- **Function:** Same as .bat but for PowerShell environments

## When to Use
- **Setup:** Run GitHub setup scripts during initial project setup
- **Reporting:** Use work-summary.js for periodic progress reports
- **Development:** Reference these scripts when setting up new environments

## Adding New Scripts
When adding new utility scripts:
1. Place them in this folder
2. Update this README with description
3. Follow naming convention: `lowercase-kebab-case.{ext}`

---

**Last Updated:** March 31, 2026
