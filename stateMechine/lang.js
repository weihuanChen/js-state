const { NonTerminalSymbol } = require("./NonTerminalSymbol");
const { TerminalSymbol } = require("./TerminalSymbol");
const { EOFSymbol } = require("./EOFSymbol");
const start = {
  additiveExpression: {
    EOF: { $end: true },
    "+": {
      mulitiplicativeExression: {
        $reduce: "additiveExpression",
      },
    },
  },
  // 展开在平级
  mulitiplicativeExression: {
    $reduce: "additiveExpression",
    "*": {
      primaryExpression: {
        $reduce: "mulitiplicativeExression",
      },
    },
  },

  // 往上归约
  primaryExpression: {
    $reduce: "mulitiplicativeExression",
  },

  "(": {
    additiveExpression: {
      ")": {
        $reduce: "primaryExpression",
      },
    },
  },

  number: {
    $reduce: "primaryExpression",
  },
};
const rules = {
  additiveExpression: [
    ["mulitiplicativeExression"],
    ["additiveExpression", "+", "mulitiplicativeExression"],
  ],
  mulitiplicativeExression: [
    ["primaryExpression"],
    ["mulitiplicativeExression", "*", "primaryExpression"],
  ],
  primaryExpression: [["(", "additiveExpression", ")"], ["number"]],
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
  // console.log(state);
  return;
}
run(newStart);

const numReg = /(?<num>[0-9]|([1-9]\d+))|(?<operator>[+\-*\/\%()])/g;
let word,
  state = newStart;
const str = "1+2";
const stack = [];
const stateStack = [newStart];
function insertSymbol(symbol) {
  if (state[symbol.type]) {
    // shift 移入
    state = state[symbol.type];
    stack.push(symbol);
    stateStack.push(state);
  } else {
    // reduce 归约,不接受状态
    if (state.$reduce) {
      let count = state.$reduce.count;
      const children = [];
      while (count > 0) {
        const item = stack.pop();
        stateStack.pop();
        children.push(item);
        count--;
      }
      const o = new NonTerminalSymbol(state.$reduce.result, children);
      // console.log("stateStackChildren", stateStack[stateStack.length - 1]);
      // console.log("type", o.type);
      // 上一次状态
      state = stateStack[stateStack.length - 1][o.type];
      stack.push(o);
      stateStack.push(o);
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
  insertSymbol(symbol);
}
insertSymbol(new EOFSymbol());
console.log(1);
