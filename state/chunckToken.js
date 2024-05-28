const { HtmlParser } = require("./HtmlParser");
const bodyParser = new HtmlParser();
const template = `<html><body><svg><circle cx="50" cy="50" r="50"/></svg></body></html>`;
const result = [{ type: "document", children: [] }];
// 遍历操作
bodyParser.onData = function (token) {
  if (!token.isClose) {
    const element = {
      type: "element",
      tagName: token?.tagName ||'',
      attributes: token?.attributes || '',
      children: [],
    };
    result[result.length - 1]["children"].push(element);
    // shfit 移入 从左到右
    result.push(element);
  } else {
    // closetag
    if (result[result.length - 1].tagName !== token.tagName) {
      console.log("missing match");
      return false
    }
    // 将两个标签合并的操作被称为reduce 合并 翻译成归约
    // 从右到左
    result.pop();
  }
};
bodyParser.write(template);
bodyParser.end();
// console.log(result);
console.log("result", JSON.stringify(result[0],null,'  '));
