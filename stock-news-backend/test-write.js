
const fs = require('fs');
const path = require('path');

console.log('Starting test-write.js...');
const testFile = path.join(__dirname, 'test-output.txt');
fs.writeFileSync(testFile, `Test successful at ${new Date().toISOString()}\n`, { flag: 'a' });
console.log('Wrote to test-output.txt');
console.log('Now starting server...');

const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5002;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => res.json({ status: 'OK', port: PORT }));
app.get('/', (req, res) => res.json({ message: 'Hello from server!' }));

app.listen(PORT, () => {
    const logMsg = `Server listening on port ${PORT} at ${new Date().toISOString()}\n`;
    fs.writeFileSync(testFile, logMsg, { flag: 'a' });
    console.log(logMsg);
});
