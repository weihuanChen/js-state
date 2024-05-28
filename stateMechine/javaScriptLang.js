/** js 求clouse */
const { NonTerminalSymbol } = require("./NonTerminalSymbol");
const { TerminalSymbol } = require("./TerminalSymbol");
const { EOFSymbol } = require("./EOFSymbol");
const { Refernece } = require("./Refernece");
const rules = {
  additiveExpression: [
    ["mulitiplicativeExression"],
    ["additiveExpression", "+", "mulitiplicativeExression"],
  ],
  literal: [["number"]],
  leftHandSide: [["identifier"]],
  assignmentExpression: [
    ["leftHandSide"],
    ["leftHandSide", "=", "assignmentExpression"],
  ],
  mulitiplicativeExression: [
    ["primaryExpression"],
    ["mulitiplicativeExression", "*", "primaryExpression"],
  ],
  expExpression: [
    ["primaryExpression"],
    ["expExpression", "**", "primaryExpression"],
  ],
  primaryExpression: [
    ["(", "additiveExpression", ")"],
    ["literal"],
    ["leftHandSide"],
  ],
};
const newStart = {
  additiveExpression: {
    EOF: { $end: true },
  },
};
const dictionary = new Map();
function run(state) {
  const hashCode = JSON.stringify(state);
  if (dictionary.has(hashCode)) {
    return dictionary.get(hashCode);
  }
  dictionary.set(hashCode, state);

  const queue = [...Object.keys(state)];
  const symbolSet = new Set();

  while (queue.length) {
    const symbol = queue.shift();
    if (symbolSet.has(symbol)) {
      continue;
    }
    symbolSet.add(symbol);
    const current = rules[symbol];
    if (!current) {
      continue;
    }
    for (const ruleBody of current) {
      let prev = state;
      queue.push(ruleBody[0]);
      for (const part of ruleBody) {
        prev[part] = prev[part] || {};
        prev = prev[part];
      }
      prev["$reduce"] = { result: symbol, count: ruleBody.length };
    }
  }
  for (const key in state) {
    if (key.startsWith("$")) {
      continue;
    }
    const res = run(state[key]);
    if (typeof res === "object") {
      state[key] = res;
    }
  }
  return;
}
run(newStart);
const numReg =
  /(?<num>([1-9]\d+)|[0-9])|(?<operator>[+\-\*\/\%\(\)\=])|(?<identifier>(\w[a-zA-Z0-9]+)|\w)/g;
let word,
  state = newStart;
const str = "1+2";

const stack = [];
const stateStack = [newStart];
function insertSymbol(symbol) {
  if (state[symbol.type]) {
    // shift 移入
    state = state[symbol.type];
    stateStack.push(state);
    stack.push(symbol);
  } else {
    // reduce 归约,不接受状态
    if (state.$reduce) {
      let count = state.$reduce.count;
      // const children = [];
      // while (count > 0) {
      //   const item = stack.pop();
      //   stateStack.pop();
      //   children.push(item);
      //   count--;
      // }

      const children = stack.splice(stack.length - count, count);
      stateStack.splice(stateStack.length - count, count);

      const o = new NonTerminalSymbol(state.$reduce.result, children);
      // 上一次状态
      state = stateStack[stateStack.length - 1][o.type];
      stateStack.push(state);
      stack.push(o);

      insertSymbol(symbol);
    } else {
      // eof  error
      if (symbol.type !== "EOF") {
        throw new Error(`Uncaught SyntaxError: Unexpected ${symbol.type}`);
      } else {
        // todo
      }
    }
  }
}
while ((word = numReg.exec(str))) {
  const symbol = new TerminalSymbol(word);
  // console.log("token", symbol);
  insertSymbol(symbol);
}
insertSymbol(new EOFSymbol());
console.log(1);

// 运行时
const ast = stack[0];
// 全局
const globalEnv = new Map();
class FunctionObject {
  constructor(body) {
    this.body = body;
  }
  call() {
    return evaluate(this.body);
  }
}
const evaluator = {
  Script(node) {
    return evaluate(node.children[0]);
  },
  statementList(node) {
    if (node.children[0].type === "StatementList") {
      evaluate(node.children[0]);
      return evaluate(node.children[1]);
    } else {
      return evaluate(node.children[0]);
    }
  },
  statement(node) {
    return evaluate(node.children[0]);
  },
  expressionStatement(node) {
    return evaluate(node.children[0]);
  },
  expression(node) {
    return evaluate(node.children[0]);
  },
  assignmentExpression(node) {
    if (node.children.length > 1) {
      const left = evaluate(node.children[0]);
      evaluate(node.children[2]);
      left.set(value);
      return value;
    } else {
      return evaluate(node.children[0]);
    }
  },
  compareExpression(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0]);
    }
  },
  additiveExpression(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0]);
    } else {
      return evaluate(node.children[0]) + evaluate(node.children[2]);
    }
  },
  mulitiplicativeExression(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0]);
    } else {
      return evaluate(node.children[0]) * evaluate(node.children[2]);
    }
  },
  primaryExpression(node) {
    if (node.children.length === 1) {
      if (node.children[0].type === "LeftHandSide") {
        const left = evaluate(node.children[0]);
        return left.get();
      }
      return evaluate(node.children[0]);
    } else {
      return evaluate(node.children[1]);
    }
  },
  literal(node) {
    if (node.children[0].type === "number") {
      return Number(node.children[0].value);
    }
  },
  leftHandSide(node) {
    return evaluate(node.children[0].value);
  },
  declarationStatement(node) {
    const identifier = node.children[1];
    globalEnv.set(identifier.value, undefined);
    if (node.children[2].type === "=") {
      let value = evaluate(node.children[3]);
      globalEnv.set(identifier.value, value);
    }
  },
  // 求值
  identifier(node) {
    return new Refernece(globalEnv, node.value);
  },
  functionStatement(node) {
    let fn;
    if (node.children.length === 8) {
      fn = new FunctionObject(node.children[6]);
    } else if (node.children.length === 7) {
      fn = new FunctionObject(node.children[5]);
    }
    const fnName = node.children[1].value;
    globalEnv.set(fnName, fn);
  },
  functionCall(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0]);
    } else {
      // 带参数
      return evaluate(node.children[0]).call();
    }
  },
};
function evaluate(node) {
  return evaluator[node.type](node);
}
