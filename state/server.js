const http = require("node:http");

// Create a local server to receive data from
const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(
    `<html><body><div style="color:red;">hello world</div></body><i/></html>`
  );
  // res.end(`<i/>`);
});

server.listen(10000);
