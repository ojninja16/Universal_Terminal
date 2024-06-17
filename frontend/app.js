const socket = io();

socket.on('terminalUpdate', (data) => {
    const terminalOutput = document.getElementById('terminal-output');
    const parsedData = parseTerminalData(data);
    terminalOutput.innerHTML += parsedData;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
});

socket.on('terminalError', (errorMessage) => {
    const terminalOutput = document.getElementById('terminal-output');
    const errorOutput = `<div class="error"><span class="timestamp">[${new Date().toLocaleTimeString()}]</span> ${escapeHtml(errorMessage)}</div>`;
    terminalOutput.innerHTML += errorOutput;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
});

socket.on('connect_error', (err) => {
    console.error('Connection error:', err.message);
    const terminalOutput = document.getElementById('terminal-output');
    const errorOutput = `<div class="error"><span class="timestamp">[${new Date().toLocaleTimeString()}]</span> Connection error: ${escapeHtml(err.message)}</div>`;
    terminalOutput.innerHTML += errorOutput;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
});

function parseTerminalData(data) {
    const lines = data.split('\n');
    let parsedContent = '';

    lines.forEach(line => {
        const timestamp = new Date().toLocaleTimeString();
        if (line.startsWith('PS>') || line.startsWith('CMD>')) {
            parsedContent += `<div class="command"><span class="timestamp">[${timestamp}]</span> ${escapeHtml(line)}</div>`;
        } else if (line.includes('Error') || line.includes('Exception')) {
            parsedContent += `<div class="error"><span class="timestamp">[${timestamp}]</span> ${escapeHtml(line)}</div>`;
        } else {
            parsedContent += `<div class="output"><span class="timestamp">[${timestamp}]</span> ${escapeHtml(line)}</div>`;
        }
    });

    return parsedContent;
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
