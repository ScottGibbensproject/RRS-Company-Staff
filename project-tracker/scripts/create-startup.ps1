$WshShell = New-Object -ComObject WScript.Shell
$StartupPath = "$env:APPDATA\Microsoft\Windows\Start Menu\Programs\Startup\ProjectTracker.lnk"
$Shortcut = $WshShell.CreateShortcut($StartupPath)
$Shortcut.TargetPath = "C:\Users\scott\Desktop\RRS Company\project-tracker\start-tracker.bat"
$Shortcut.WorkingDirectory = "C:\Users\scott\Desktop\RRS Company\project-tracker"
$Shortcut.WindowStyle = 7
$Shortcut.Save()
Write-Host "Startup shortcut created at: $StartupPath"
