const { Writable } = require("node:stream");
const { createReadStream } = require("node:fs");
const { HtmlParser } = require("./HtmlParser");
const { StringStream } = require("./StringStream");
class Collector extends Writable {
  constructor() {
    super();
    this.data = [];
  }
  write(p) {
    console.log("params:", p);
    this.data.push(p.toString());
  }
  end() {
    console.log("collector end");
    console.log(this.data);
  }
}
const result = new Collector();
const bodyParser = new HtmlParser();
bodyParser.pipe(result);
// createReadStream("./2.txt").pipe(bodyParser).pipe(result);
new StringStream("<div></div>").pipe(bodyParser)

// bodyParser.write('<div style="color"></div>')
// bodyParser.end()
