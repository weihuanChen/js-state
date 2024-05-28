const { TerminalSymbol } = require("./TerminalSymbol");
const { EOFSymbol } = require("./EOFSymbol");
const { start } = require("./production");
const { run } = require("./parse");
const { regx } = require("./reg");
const { insertSymbol,stack } = require("./symbolOptions");
const { evaluator,executionContextStack } = require("./evaluator");
// 展开状态指示器
run(start);

//const DeclarationStatement = "1+2";
// const DeclarationStatement = "let a = 1;function getName(){ a = 3; }getName();";
const DeclarationStatement = 'while(true){}'
let token = start;
while ((token = regx.exec(DeclarationStatement))) {
  if (token.groups.whitespace) {
    continue;
  }
  const symbol = new TerminalSymbol(token);
  insertSymbol(symbol);
}
// 操作symbol
insertSymbol(new EOFSymbol());
// 运行时
const ast = stack[0];
const res = evaluator.Script(ast);
console.log(res);
