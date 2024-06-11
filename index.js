import http from 'http';
import express from 'express';
import chokidar from 'chokidar';
import { WebSocketServer } from 'ws';
import fs from 'fs';
import path from 'path';
import stripAnsi from 'strip-ansi';
import Tail from 'tail-file';

const app = express();
app.use(express.static('public'));
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const logFilePath = path.join(process.env.USERPROFILE || process.env.HOME, 'universal-terminal-log.txt');

wss.on('connection', (ws) => {
    console.log('New client connected');
    fs.readFile(logFilePath, 'utf8', (err, data) => {
        if (!err) {
            ws.send(filterLogContent(data));
        }
    });
    const tail = new Tail(logFilePath, { startPos: 0 });
    tail.on('line', (line) => {
        ws.send(filterLogContent(line));
    });

    tail.on('error', (err) => {
        console.error('TailFile error:', err);
    });

    try {
        tail.start();
    } catch (error) {
        console.error('TailFile error:', error);
        
    }

    ws.on('close', () => {
        console.log('Client disconnected');
        tail.stop();
    });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
function filterLogContent(content) {
    const lines = content.split('\n');
    console.log(lines);
    const filteredLines = lines.filter(line => {
        return line.trim() !== '' && !line.includes('Transcript started') && !line.includes('Transcript stopped');
    });
    return stripAnsi(filteredLines.join('\n'));
}
