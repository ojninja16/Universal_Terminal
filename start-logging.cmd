@echo off
for /F "tokens=*" %%i in ('powershell -command "Get-Date"') do set timestamp=%%i
set logfile=%USERPROFILE%\universal-terminal-log.txt
echo --- Session Started at %timestamp% --- >> %logfile%
powershell -command "Start-Transcript -Path %logfile% -Append"
