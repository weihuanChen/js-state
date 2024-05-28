// 四则运算 带括号  整数  词法产生式
// <number> ::= 0-9 | 1-9 //0-9或1-9
// <number1> ::: = 1-9 | <number1> <number>
// <number3> ::= <number> | <number2>
// <operator> ::= + | - | * | / | ( | )      有优先级
// <token> ::= <number3> | <operator>
// <expression> ::= <token>|<expression><token>
//  <mulitiplicativeExression> ::= <primaryExpression> | <mulitiplicativeExression> * <primaryExpression>
//  <additiveExpression> ::= <mulitiplicativeExression> | <additiveExpression> + <mulitiplicativeExression>
//  <primaryExpression> ::= (<additiveExpression>) | <number3>  


// 产生式写lr语法分析，本质上是针对产生式的各种情况处理代码
const { NonTerminalSymbol } = require("./NonTerminalSymbol");
const { TerminalSymbol } = require("./TerminalSymbol");
const { EOFSymbol } = require("./EOFSymbol");
// const { ArithmeticState } = require("./arithmeticState");
const numReg = /(?<num>[0-9]|([1-9]\d+))|(?<operator>[+\-*\/\%()])/g;
let word;
const str = "1+4%2";
const stack = [];
// console.log('reg test:',numReg.test(str));
// 从左到右扫描
while ((word = numReg.exec(str))) {
  const obj = new TerminalSymbol(word);
  stack.push(obj);
}
// 状态机
// const stack1 = []
// const arithmeticParser = new ArithmeticState();
// arithmeticParser.onData = function (token){
//   console.log(token);
//   stack1.push(token)
// }
// arithmeticParser.write(str)
// console.log(stack1);


stack.push(new EOFSymbol());
additiveExpression(stack);

console.log("stack", JSON.stringify(stack, null, "  "));

// 优先级2 加法
function additiveExpression(stack) {
  // if (stack[0].type === "number" && stack[1].type === "*") { //第一个是数字 ，第二个是乘号
  //   mulitiplicativeExression(stack);
  //   additiveExpression(stack)
  // } else if (stack[0].type === "number" && stack[1].type === "+") { // 第一个是数字，第二个是加号
  //   mulitiplicativeExression(stack);
  // }
  if (stack[0].type == "number") {
    mulitiplicativeExression(stack);
    additiveExpression(stack);
  } else if (stack[0].type === "(") {
    mulitiplicativeExression(stack);
    additiveExpression(stack);
  } else if (stack[0].type === "MulitiplicativeExression") {
    const mul = stack.shift();
    const obj = new NonTerminalSymbol("AdditiveExpression", [mul]);
    stack.unshift(obj);
    additiveExpression(stack);
  } else if (stack[0].type === "AdditiveExpression" && stack[1].type === "+") {
    const add = stack.shift();
    const op = stack.shift();
    mulitiplicativeExression(stack);
    const mul = stack.shift();
    const obj = new NonTerminalSymbol("AdditiveExpression", [add, op, mul]);
    stack.push(obj);
    additiveExpression(stack);
  } else if (
    stack[0].type === "AdditiveExpression" &&
    (stack[1].type === "EOF" || stack[1].type === ")")
  ) {
    return;
  }
}
// 优先级1
function mulitiplicativeExression(stack) {
  if (
    (stack[0].type === "number" && stack[1].type === "*") ||
    stack[0].type === "(" ||
    (stack[0].type === "number" && stack[1].type === "+") ||
    (stack[0].type === "number" && stack[1].type === "-") ||
    (stack[0].type === "number" && stack[1].type === "/") ||
    (stack[0].type === "number" && stack[1].type === "%")
  ) {
    primaryExpression(stack);
    mulitiplicativeExression(stack);
  } else if (stack[0].type === "PrimaryExpression") {
    //规约
    const cur = stack.shift();
    const obj = new NonTerminalSymbol("MulitiplicativeExression", [cur]);
    stack.unshift(obj);
    mulitiplicativeExression(stack);
  } else if (
    (stack[0].type === "MulitiplicativeExression" && stack[1].type === "*") ||
    (stack[0].type === "MulitiplicativeExression" && stack[1].type === "/") ||
    (stack[0].type === "MulitiplicativeExression" && stack[1].type === "%")
  ) {
    const mul = stack.shift(); // 对应multiple
    const op = stack.shift(); // 对应 *
    primaryExpression(stack); // 第三个可能是prim或者number，先调用primaryExpression处理
    const prim = stack.shift(); // 对应)
    const obj = new NonTerminalSymbol(mulitiplicativeExression, [
      mul,
      op,
      prim,
    ]);
    stack.unshift(obj);
    mulitiplicativeExression(stack);
  } else {
    return;
  }
}
// 优先级0
// 调用自身的条件是产生式中包含了自身，在调用自身的过程中可能与其他的产生式一块组成了新的自身
function primaryExpression(stack) {
  if (stack[0].type === "number") {
    //第一个number直接规约
    // 对应 <number3> 直接数字
    const num = stack.shift(); // 把第一个元素拿出来
    const obj = new NonTerminalSymbol("PrimaryExpression", [num]);
    stack.unshift(obj);
  } else if (stack[0].type === "(") {
    // 对应 (<additiveExpression>)
    const leftBracket = stack.shift();
    additiveExpression(stack);
    const add = stack.shift();
    const rightBracket = stack.shift();
    const obj = new NonTerminalSymbol("PrimaryExpression", [
      leftBracket,
      add,
      rightBracket,
    ]);
    stack.unshift(obj);
  }
}
