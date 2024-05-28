const { HtmlParser } = require("../state/HtmlParser");
describe("compiler", () => {
  it("open tag", async () => {
    const template = "<div></div>";
    bodyParser = new HtmlParser();
    const result = [];
    bodyParser.onData = function (token) {
      result.push(token);
    };
    bodyParser.write(template);
    bodyParser.end();
    expect(JSON.stringify(result)).toEqual(
      '[{"type":"opentag","attributes":{},"tagName":"div"},{"type":"closeTag","attributes":{},"tagName":"div"}]'
    );
  });
  it("open tag and space", async () => {
    const template = "<div ></div>";
    bodyParser = new HtmlParser();
    const result = [];
    bodyParser.onData = function (token) {
      result.push(token);
    };
    bodyParser.write(template);
    bodyParser.end();
    expect(JSON.stringify(result)).toEqual(
      '[{"type":"opentag","attributes":{},"tagName":"div>"},{"type":"closeTag","attributes":{},"tagName":"div"}]'
    );
  });
  it("multiple attributes", async () => {
    const template = `<div style="color:red;" class="i1"></div>`;
    bodyParser = new HtmlParser();
    const result = [];
    bodyParser.onData = function (token) {
      result.push(token);
    };
    bodyParser.write(template);
    bodyParser.end();
    expect(JSON.stringify(result)).toEqual(
      '[{"type":"opentag","attributes":{"style":"style","styleclass":"styleclass"},"tagName":"div"},{"type":"closeTag","attributes":{},"tagName":"div"}]'
    );
  });
  it("multiple tag", async () => {
    const template = `<div><p></p></div>`;
    bodyParser = new HtmlParser();
    const result = [];
    bodyParser.onData = function (token) {
      result.push(token);
    };
    bodyParser.write(template);
    bodyParser.end();
    expect(JSON.stringify(result)).toEqual(
      '[{"type":"opentag","attributes":{},"tagName":"div"},{"type":"opentag","attributes":{},"tagName":"p"},{"type":"closeTag","attributes":{},"tagName":"p"},{"type":"closeTag","attributes":{},"tagName":"div"}]'
    );
  });
  it("self closeing and attributes", () => {
    const template = "<i color='red' />";
    bodyParser = new HtmlParser();
    const result = [];
    bodyParser.onData = function (token) {
      result.push(token);
    };
    bodyParser.write(template);
    bodyParser.end();
    expect(JSON.stringify(result)).toEqual(
      '[{"type":"selfCloseingTag","attributes":{"color":"red"},"tagName":"i"}]'
    );
  });
  it("attributes and many space", () => {
    const template = "<i       color='red' />";
    bodyParser = new HtmlParser();
    const result = [];
    bodyParser.onData = function (token) {
      result.push(token);
    };
    bodyParser.write(template);
    bodyParser.end();
    expect(JSON.stringify(result)).toEqual(
      '[{"type":"selfCloseingTag","attributes":{"color":"red"},"tagName":"i"}]'
    );
  });
  it("open tag and attributes", () => {
    const template = `<div style="color:red;"></div>`;
    bodyParser = new HtmlParser(template);
    const result = [];
    bodyParser.onData = function (token) {
      result.push(token);
    };
    bodyParser.write(template);
    bodyParser.end();
    expect(JSON.stringify(result)).toEqual(
      '[{"type":"opentag","attributes":{"style":"style"},"tagName":"div"},{"type":"closeTag","attributes":{},"tagName":"div"}]'
    );
  });
  it("self closeing", () => {
    const template = "<i />";
    bodyParser = new HtmlParser();
    const result = [];
    bodyParser.onData = function (token) {
      result.push(token);
    };
    bodyParser.write(template);
    bodyParser.end();
    expect(JSON.stringify(result)).toEqual(
      '[{"type":"selfCloseingTag","attributes":{},"tagName":"i"}]'
    );
  });
  it("text tag", () => {
    const template = "hello world";
    bodyParser = new HtmlParser();
    const result = [];
    bodyParser.onData = function (token) {
      result.push(token);
    };
    bodyParser.write(template);
    bodyParser.end();
    expect(JSON.stringify(result)).toEqual(
      '[{"type":"text","value":"h"},{"type":"text","value":"e"},{"type":"text","value":"l"},{"type":"text","value":"l"},{"type":"text","value":"o"},{"type":"text","value":" "},{"type":"text","value":"w"},{"type":"text","value":"o"},{"type":"text","value":"r"},{"type":"text","value":"l"},{"type":"text","value":"d"}]'
    );
  });
  it("dom tree", () => {
    const template = `<html><body><div style="color:red;">hello world</div></body><i/></html>`;
    bodyParser = new HtmlParser();
    const result = [];
    bodyParser.onData = function (token) {
      result.push(token);
    };
    bodyParser.write(template);
    bodyParser.end();
    expect(JSON.stringify(result)).toEqual(
      '[{"type":"opentag","attributes":{},"tagName":"html"},{"type":"opentag","attributes":{},"tagName":"body"},{"type":"opentag","attributes":{"style":"style"},"tagName":"div"},{"type":"text","value":"h"},{"type":"text","value":"e"},{"type":"text","value":"l"},{"type":"text","value":"l"},{"type":"text","value":"o"},{"type":"text","value":" "},{"type":"text","value":"w"},{"type":"text","value":"o"},{"type":"text","value":"r"},{"type":"text","value":"l"},{"type":"text","value":"d"},{"type":"closeTag","attributes":{},"tagName":"div"},{"type":"closeTag","attributes":{},"tagName":"body"}]'
    );
  });
  it("before attributes error", () => {
    const template = `<div color="red" -----></div>`;
    bodyParser = new HtmlParser();
    const result = [];
    bodyParser.onData = function (token) {
      result.push(token);
    };
    bodyParser.write(template);
    bodyParser.end();
  });
  it("self closeing error", () => {
    const template = `<i   /div>`;
    bodyParser = new HtmlParser();
    const result = [];
    bodyParser.onData = function (token) {
      result.push(token);
    };
    bodyParser.write(template);
    bodyParser.end();
  });
  it("attributes value error", () => {
    const template = `<div style='color:red;" ></div>`;
    bodyParser = new HtmlParser();
    const result = [];
    bodyParser.onData = function (token) {
      result.push(token);
    };
    bodyParser.write(template);
    bodyParser.end();
  });
  it("parse tree", () => {
    const template = `<div style='color:red;" ></div>`;
    bodyParser = new HtmlParser();
    const result = [];
    bodyParser.onData = function (token) {
      result.push(token);
    };
    bodyParser.write(template);
    bodyParser.end();
  });
});
