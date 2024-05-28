// symbol 操作
const { start } = require("./production");
const { NonTerminalSymbol } = require("./NonTerminalSymbol");
let state = start;
const stack = [];
const stateStack = [start];
const insertSymbol = function (symbol) {
  if (state[symbol.type]) {
    // shift
    state = state[symbol.type];
    stateStack.push(state);
    stack.push(symbol);
  } else {
    // reduce
    if (state.$reduce) {
      let count = state.$reduce.count;
      const children = stack.splice(stack.length - count, count);
      stateStack.splice(stateStack.length - count, count);

      const obj = new NonTerminalSymbol(state.$reduce.result, children);
      state = stateStack[stateStack.length - 1][obj.type];
      stateStack.push(state);
      stack.push(obj);

      insertSymbol(symbol);
    } else {
      // EOF or 错误
      if (symbol.type !== "EOF") {
        throw new Error(
          `Uncaught SyntaxError: Unexpected ${symbol.type} ${symbol.value}`
        );
      } else {
        // TODO
      }
    }
  }
  // console.log('symbol:', symbol)
  // console.log('state:', state);
  // console.log('=============================')
};
module.exports = {
  insertSymbol,stack
};
