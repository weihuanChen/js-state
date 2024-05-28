

// 产生式写lr语法分析，本质上是针对产生式的各种情况处理代码
const { NonTerminalSymbol } = require("./NonTerminalSymbol");
const { TerminalSymbol } = require("./TerminalSymbol");
const { EOFSymbol } = require("./EOFSymbol");
// const { ArithmeticState } = require("./arithmeticState");
const numReg = /(?<num>[0-9]|([1-9]\d+))|(?<operator>[+\-*\/\%()])/g;
let word;
const str = "1+2";
const stack = [];
// console.log('reg test:',numReg.test(str));
// 从左到右扫描
while ((word = numReg.exec(str))) {
  const obj = new TerminalSymbol(word);
  stack.push(obj);
}


stack.push(new EOFSymbol());
additiveExpression(stack);

// console.log("stack", JSON.stringify(stack, null, "  "));

// 优先级2 加法
function additiveExpression(stack) {
  
 
}
// 优先级1
function mulitiplicativeExression(stack) {
  
}
// 优先级0
// 调用自身的条件是产生式中包含了自身，在调用自身的过程中可能与其他的产生式一块组成了新的自身
function primaryExpression(stack) {
  
}
