
console.log("Test minimal script is running!");
console.log("Current directory:", process.cwd());
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ message: 'Minimal server works!', url: req.url }));
});
server.listen(5000, () => {
  console.log("Minimal server listening on port 5000!");
  console.log("Test it at http://localhost:5000/");
});
