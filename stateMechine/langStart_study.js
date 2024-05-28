// 根据状态指示描
// <lang> ::= <additiveExpression> <EOF>
// <additiveExpression> := <mulitiplicativeExression> | <additiveExpression> + <mulitiplicativeExression>

// start既能接收add又能接收mulitip
// 归约 reduce 往上归约
const start = {
  additiveExpression: {
    EOF: {
      $end: true, // 用$符号来表示一些特殊的状态,比如结束状态
    },
    "+": {
      mulitiplicativeExression: {
        $reduce: "additiveExpression",
      },
    },
  },
  mulitiplicativeExression: {
    // 单个mulitip reduce成addtive
    $reduce: "additiveExpression",
    "*": {
      primaryExpression: {
        $reduce: "mulitiplicativeExression",
      },
    },
  },
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
  // <additiveExpression> + <mulitiplicativeExression>的状态，需要合并到上述addtivite
  // additiveExpression: {
  //   "+": {
  //     mulitiplicativeExression: {
  //       $reduce: "additiveExpression",
  //     },
  //   },
  // },
};
const { NonTerminalSymbol } = require("./NonTerminalSymbol");
const { TerminalSymbol } = require("./TerminalSymbol");
const { EOFSymbol } = require("./EOFSymbol");
/**
 * state:{
 *    '(':{
 *        'additiveExpression':{
 *            ')':{}
 *        }
 *     }
 * }
 */
// const state = {};
// const arr = ["(", "additiveExpression", ")"];
// let prev = state
// for (const symbol of arr) {
//     prev[symbol] = {}
//     prev = prev[symbol]
// }
// console.log(JSON.stringify(state,null,'   '));

// 产生式规则
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

// 保存展开之后的对象
const dictionary = new Map();
function run(state) {
  // 存储展开之后的对象/递归调用
  const hashCode = JSON.stringify(state);
  if (dictionary.has(hashCode)) {
    return dictionary.get(hashCode);
  }
  dictionary.set(hashCode, state);

  const symbolSet = new Set();
  const queue = [...Object.keys(state)];
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
      prev["$reduce"] = symbol;
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
// ---状态机运行完成

// 解析1+2
const str = "1+2";
const numReg = /(?<num>[0-9]|([1-9]\d+))|(?<operator>[+\-*\/\%()])/g;
// 初始状态
let toekn,
  state = newStart;
const stack = [];

// 状态迁移，lr过程
while ((word = numReg.exec(str))) {
  const symbol = new TerminalSymbol(word);
  if (state[symbol.type]) {
    //shfit
    state = state[symbol.type];
    stack.push(symbol);
  } else {
  }
}
