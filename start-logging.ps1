$pipeName = "\\.\pipe\UniversalTerminalOutput"
$stopFlagFile = "$env:USERPROFILE\stop-logging.flag"

function Write-OutputToPipe {
    param (
        [string]$output
    )
    try {
        $pipe = New-Object System.IO.Pipes.NamedPipeServerStream -ArgumentList $pipeName, [System.IO.Pipes.PipeDirection]::Out
        $pipe.WaitForConnection()
        $writer = New-Object System.IO.StreamWriter $pipe
        $writer.AutoFlush = $true
        $writer.WriteLine($output)
        $writer.Dispose()
        $pipe.Disconnect()
        $pipe.Dispose()
    } catch {
        Write-Host "Error writing to pipe: $_"
    }
}

Start-Transcript -Path "$env:USERPROFILE\universal-terminal-log.txt" -Append



while (-not (Test-Path $stopFlagFile)) {
    Start-Sleep -Seconds 1
}

Stop-Transcript
