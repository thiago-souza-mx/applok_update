Get-Process -Name applok_update | Stop-Process
Start-Process -FilePath 'C:\Program Files\applok_update\applok_update.exe'