import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import stripAnsi from 'strip-ansi';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const server = createServer(app);
const io = new Server(server);

const logFilePath = path.join(process.env.HOME || process.env.USERPROFILE, 'universal-terminal-log.txt');
app.use(express.static(path.join(__dirname, '../frontend')));
io.on('connection', (socket) => {
    console.log('New client connected');
    const streamLogs = () => {
        fs.readFile(logFilePath, 'utf8', (err, data) => {
            if (err) {
                console.error('Error reading log file:', err);
                socket.emit('terminalError', 'Error reading log file');
                return;
            }
            if (!err) {
                const cleanData = stripAnsi(data);
                socket.emit('terminalUpdate', cleanData.split('\n').slice(-10).join('\n')); // Send last 10 lines
            }
        });
    };
    try {
        fs.watchFile(logFilePath, { interval: 500 }, (curr, prev) => {
            streamLogs();
        });
    } catch (watchError) {
        console.error('Error setting up file watcher:', watchError);
        socket.emit('terminalError', 'Error setting up file watcher');
    }

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
