// closure
const start = {
  AdditiveExpression: {
    EOF: {
      $end: true,
    },
    "+": {
      MultiplicativeExpression: {
        $reduce: "AdditiveExpression",
      },
    },
  },
  MultiplicativeExpression: {
    $reduce: "AdditiveExpression",
    "*": {
      PrimaryExpression: {
        $reduce: "MultiplicativeExpression",
      },
    },
  },
  PrimaryExpression: {
    $reduce: "MultiplicativeExpression",
  },
  "(": {
    AdditiveExpression: {
      ")": {
        $reduce: "PrimaryExpression",
      },
    },
  },
  number: {
    $reduce: "PrimaryExpression",
  },
};

const start1 = {
  Script: {
    EOF: {
      $end: true,
    },
  },
};
const rules = {
  AdditiveExpression: [
    ["MultiplicativeExpression"],
    ["AdditiveExpression", "+", "MultiplicativeExpression"],
  ],
  MultiplicativeExpression: [
    ["CallExpression"],
    ["MultiplicativeExpression", "*", "CallExpression"],
  ],
  PrimaryExpression: [
    ["(", "AdditiveExpression", ")"],
    ["Literal"],
    ["LeftHandSide"],
  ],
  CallExpression: [["PrimaryExpression"], ["CallExpression", "(", ")"]],
  Compare: [[">"], ["<"], ["==="], ["!=="]],
  CompareExpression: [
    ["AdditiveExpression"],
    ["CompareExpression", "Compare", "AdditiveExpression"],
  ],
  Literal: [["number"]],
  LeftHandSide: [["identifier"]],
  Declaration: [["let"], ["const"], ["var"]],
  DeclarationStatement: [
    ["Declaration", "identifier", "=", "CompareExpression", ";"],
    ["Declaration", "identifier", ";"],
  ],
  AssignmentExpression: [
    ["CompareExpression"],
    ["LeftHandSide", "=", "CompareExpression"],
  ],
  ExpressionStatement: [["Expression", ";"]],
  Statement: [
    ["ifStatement"],
    ["ExpressionStatement"],
    ["Block"],
    ["ReturnStatement"],
    ["DeclarationStatement"],
  ],
  Expression: [["AssignmentExpression"]],
  ifStatement: [["if", "(", "Expression", ")", "Statement"]],
  StatementList: [["Statement"], ["StatementList", "Statement"]],
  Block: [
    ["{", "StatementList", "}"],
    ["{", "}"],
  ],
  ReturnStatement: [["return", "Expression", ";"]],
  Arguments: [["identifier"], ["Arguments", ",", "identifier"]],
  FunctionStatement: [
    [
      "function",
      "identifier",
      "(",
      "Arguments",
      ")",
      "{",
      "StatementList",
      "}",
    ],
    ["function", "identifier", "(", ")", "{", "StatementList", "}"],
  ],
  Method: [["identifier", "(", "Arguments", ")", "{", "StatementList", "}"]],
  MethodList: [["Method"], ["MethodList", "Method"]],
  ClassStatement: [["class", "identifier", "{", "MethodList", "}"]],
  Script: [["StatementList"], ["FunctionStatement"]],
};

// closure
const dictionary = new Map();

function run(state) {
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
      // AdditiveExpression:[……]
      let prev = state;
      queue.push(ruleBody[0]);
      for (const part of ruleBody) {
        // [ 'AdditiveExpression','+','MultiplicativeExpression']
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

  // console.log(JSON.stringify(state, null, 4));
  return;
}

class TerminalSymbol {
  constructor(obj) {
    if (obj.groups.num) {
      this.type = "number";
      this.value = obj.groups.num;
    } else if (obj.groups.operator) {
      this.type = obj.groups.operator;
    } else if (obj.groups.identifier) {
      this.type = "identifier";
      this.value = obj.groups.identifier;
    } else if (obj.groups.keyword) {
      this.type = obj.groups.keyword;
    }
  }
}

class NonTerminalSymbol {
  constructor(type, children) {
    this.type = type;
    this.children = children;
  }
}

class EOFSymbol {
  constructor() {
    this.type = "EOF";
  }
}

run(start1);
console.log(1);
// 1+2;
/*
 *                   AdditiveExpression
 * AdditiveExpression            AdditiveExpression
 * MultiplicativeExpression      MultiplicativeExpression
 * PrimaryExpression             PrimaryExpression
 * num                           num
 * */
// const expression = 'function(aa,cc){if(a=1){age=11+2*3;return 11;}}';
// const classExpression = 'class Person{setName(val){if(a=1){let a=1;return a;}return 3;}}'
// const ifStatement = 'if(a<1){age=11+2*3;}'
//const DeclarationStatement = '1+2'
const DeclarationStatement = "function getName(){let a=1;}";
let regxStr = `(?<num>([1-9]\\d+)|[0-9])
    (?<operator>[+\\-*\\/()={};,<>]|===|!==)
    (?<keyword>(if|return|function|class|let|const|var)(?![a-zA-Z]))
    (?<identifier>(\\w[a-zA-Z0-9]+)|\\w)
    (?<whitespace> )`;
regxStr = regxStr
  .split("\n")
  .map((item) => item.trim())
  .join("|");
const regx = new RegExp(regxStr, "g");
// regx.compile

let token,
  state = start1;

const stack = [];
const stateStack = [start1];
const insertSymbol = (symbol) => {
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

while ((token = regx.exec(DeclarationStatement))) {
  if (token.groups.whitespace) {
    continue;
  }
  const symbol = new TerminalSymbol(token);

  insertSymbol(symbol);
}
insertSymbol(new EOFSymbol());

const ast = stack[0];
const globalEnv = new Map();

class FunctionObj {
  constructor(body) {
    this.body = body;
  }

  call() {
    return evaluate(this.body);
  }
}

class Reference {
  constructor(env, name) {
    this.name = name;
    this.env = env;
  }

  get() {
    return this.env.get(this.name);
  }

  set(val) {
    this.env.set(this.name, val);
  }
}

const evaluator = {
  Script(node) {
    return evaluate(node.children[0]);
  },
  StatementList(node) {
    if (node.children[0].type === "StatementList") {
      evaluate(node.children[0]);
      return evaluate(node.children[1]);
    } else {
      return evaluate(node.children[0]);
    }
  },
  Statement(node) {
    return evaluate(node.children[0]);
  },
  ExpressionStatement(node) {
    return evaluate(node.children[0]);
  },
  Expression(node) {
    return evaluate(node.children[0]);
  },
  AssignmentExpression(node) {
    if (node.children.length > 1) {
      const left = evaluate(node.children[0]);
      const value = evaluate(node.children[2]);
      left.set(value);
      return value;
    } else {
      return evaluate(node.children[0]);
    }
  },
  CompareExpression(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0]);
    }
  },
  AdditiveExpression(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0]);
    } else {
      return evaluate(node.children[0]) + evaluate(node.children[2]);
    }
  },
  MultiplicativeExpression(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0]);
    } else {
      return evaluate(node.children[0]) * evaluate(node.children[2]);
    }
  },
  PrimaryExpression(node) {
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
  DeclarationStatement(node) {
    const identifier = node.children[1].value;
    globalEnv.set(identifier, undefined);

    if (node.children[2].type === "=") {
      const value = evaluate(node.children[3]);
      globalEnv.set(identifier, value);
    }
  },
  LeftHandSide(node) {
    return evaluate(node.children[0]);
  },
  identifier(node) {
    return new Reference(globalEnv, node.value);
  },
  Literal(node) {
    if (node.children[0].type === "number") {
      return Number(node.children[0].value);
    }
  },
  FunctionStatement(node) {
    let fn;
    if (node.children.length === 8) {
      fn = new FunctionObj(node.children[6]);
    } else if (node.children.length === 7) {
      fn = new FunctionObj(node.children[5]);
    }

    const fnName = node.children[1].value;
    globalEnv.set(fnName, fn);
  },
  CallExpression(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0]);
    } else {
      // TODO: 带参数
      return evaluate(node.children[0]).call();
    }
  },
};

function evaluate(node) {
  // console.log('node:', node);
  return evaluator[node.type](node);
}

const res = evaluator.Script(ast);
console.log(res);
