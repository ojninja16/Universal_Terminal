$logFilePath = "$env:USERPROFILE\universal-terminal-log.txt"
# Stop any existing transcription
try {
    Stop-Transcript
} catch {
    Write-Host "No existing transcription to stop."
}

# Start a new transcription
Start-Transcript -Path $logFilePath -Append

# Function to log command outputs
function Log-CommandOutput {
    param (
        [string]$output
    )
    Add-Content -Path $logFilePath -Value $output
}

# Main loop to capture command outputs
while ($true) {
    $input = Read-Host "PS>"
    Log-CommandOutput "PS> $input"
    try {
        $output = Invoke-Expression $input 2>&1
    } catch {
        $output = $_.Exception.Message
    }
    Log-CommandOutput $output
    Write-Host $output
}
