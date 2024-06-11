import http from 'http';
import express from 'express';
import { WebSocketServer } from 'ws';
import fs from 'fs';
import stripAnsi from 'strip-ansi';
import { createReadStream } from 'fs';
import net from 'net';

const app = express();
const server = http.createServer(app);
app.use(express.static('public'));
const wss = new WebSocketServer({ server });

const pipeName = '\\\\.\\pipe\\UniversalTerminalOutput';

function streamTerminalOutput(ws) {
    const pipeServer = net.createServer((stream) => {
        stream.on('data', (data) => {
            ws.send(stripAnsi(data.toString()));
        });
    });

    pipeServer.listen(pipeName, () => {
        console.log(`Listening for connections on pipe ${pipeName}`);
    });

    ws.on('close', () => {
        pipeServer.close();
    });
}

wss.on('connection', (ws) => {
    console.log('New client connected');
    streamTerminalOutput(ws);

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
