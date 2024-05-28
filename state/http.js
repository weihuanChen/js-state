const net = require("node:net");
const { ResponseParser } = require("./responseState");
const client = net.createConnection({ port: 10000 }, () => {
  // 'connect' listener.
  console.log("connected to server!");
  client.write("GET / HTTP/1.1\r\n");
  client.write("Host: 127.0.0.1\r\n");
  client.write("Content-Type: application/json\r\n");
  client.write("\r\n");
  client.write('{"name":"chenqi"}');
});
// let state = start;
// client.on("data", (data) => {
//   for (const char of data.toString()) {
//     // console.log("stateName:", state.name);
//     // console.log("char:", char);
//     state = state(char);
//   }
//   console.log(getResponse());
//   client.end();
// });
client.pipe(new ResponseParser())
client.on("end", () => {
  console.log("disconnected from server");
});
