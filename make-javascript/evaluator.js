/** 运行时 */
// 闭包
class FunctionObj {
  constructor(body, env) {
    this.body = body;
    this.env = env;
  }
  // 调用
  call() {
    // 存储this 变量 参数
    const env = new EnvironmentRecord(this.env);
    executionContextStack.push(new ExecutionContext(env));
    // 预处理
    // preprocess(this.body);
    let r = evaluate(this.body);
    executionContextStack.pop();
    return r.value;
  }
}
// 环境记录
class EnvironmentRecord {
  constructor(outer) {
    this.map = new Map();
    this.outer = outer;
  }
  get(k) {
    if (this.map.has(k)) {
      return this.map.get(k);
    } else if (this.outer) {
      return this.outer.get(k);
    } else {
      return undefined;
    }
  }
  set(k, v) {
    if (this.map.has(k)) {
      return this.map.set(k, v);
    } else if (this.outer) {
      return this.outer.set(k, v);
    } else {
      return undefined;
    }
  }
  add(k, v) {
    this.map.set(k, v);
  }
}
// 执行上下文
class ExecutionContext {
  constructor(lexicalEnvironment) {
    // 词法环境
    this.lexicalEnvironment = lexicalEnvironment;
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
class CompletionRecord {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}
const globalEnv = new EnvironmentRecord();
const executionContextStack = [new ExecutionContext(globalEnv)];

const evaluator = {
  Script(node) {
    return evaluate(node.children[0]);
  },
  StatementList(node) {
    if (node.children[0].type === "StatementList") {
      const record = evaluate(node.children[0]);
      if (record.type === "normal") {
        evaluate(node.children[0]);
      } else {
        return record;
      }
    } else {
      return evaluate(node.children[0]);
    }
  },
  Statement(node) {
    // completion
    return evaluate(node.children[0]);
  },
  ExpressionStatement(node) {
    const value = evaluate(node.children[0]);
    const record = new CompletionRecord("normal", value);
    return record;
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
    } else {
      const v1 = evaluate(node.children[0]);
      const v2 = evaluate(node.children[2]);
      if (node.children[1] === ">") {
        return v1 > v2;
      } else if (node.children[1] === "<") {
        return v1 < v2;
      } else if (node.children[1] === "===") {
        return (v1 = v2);
      } else {
        throw new Error(`不支持该比较运算符${node.children[1]}`);
      }
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
    let env =
      executionContextStack[executionContextStack.length - 1]
        .lexicalEnvironment;
    env.add(identifier, undefined);

    if (node.children[2].type === "=") {
      const value = evaluate(node.children[3]);
      env.add(identifier, value);
    }
    return new CompletionRecord("normal", undefined);
  },
  LeftHandSide(node) {
    return evaluate(node.children[0]);
  },
  identifier(node) {
    let env =
      executionContextStack[executionContextStack.length - 1]
        .lexicalEnvironment;
    return new Reference(env, node.value);
  },
  Literal(node) {
    if (node.children[0].type === "number") {
      return Number(node.children[0].value);
    }
  },
  FunctionStatement(node) {
    let fn;
    const env =
      executionContextStack[executionContextStack.length - 1]
        .lexicalEnvironment;
    if (node.children.length === 8) {
      fn = new FunctionObj(node.children[6], env);
    } else if (node.children.length === 7) {
      fn = new FunctionObj(node.children[5], env);
    }

    const fnName = node.children[1].value;
    env.add(fnName, fn);
    return new CompletionRecord("normal", undefined);
  },
  CallExpression(node) {
    if (node.children.length === 1) {
      return evaluate(node.children[0]);
    } else {
      // TODO: 带参数
      return evaluate(node.children[0]).call();
    }
  },
  ReturnStatement(node) {
    const value = evaluate(node.children[1]);
    return new CompletionRecord("return", value);
  },
  WhileStatement(node) {
    let value;
    while (true) {
      value = evaluate(node.children[2]);
      if (!value) {
        break;
      }
      const record = evaluate(node.children[4]);
      const arr = ["return", "continue", "break"];
      if (arr.includes(record.type)) {
        return record;
      }
      // if (record.type === "return") {
      //   return record;
      // }
    }
    return new CompletionRecord("normal", value);
  },
  Block() {
    return evaluate(node.children[1]);
  },
  BreakStatement() {
    return new CompletionRecord("break", undefined);
  },
  ContinueStatement() {
    return new CompletionRecord("continue", undefined);
  },
  ifStatement(node) {
    const condition = evaluate(node.children[2]);
    if (condition) {
      return evaluate(node.children[4]);
    }
    return new CompletionRecord("normal", undefined);
  },
};
const preprocesser = {
  // 同
  Script(node) {
    return preprocesser(node.children[0]);
  },
  Statement(node) {
    return preprocesser(node.children[0]);
  },
};
function evaluate(node) {
  console.log("node:", node.type);
  const r = evaluator[node.type](node);
  return r;
}
function preprocess(node) {
  // todo预处理
  console.log("preprocess:", node);
  return preprocesser[node.type](node);
}
module.exports = {
  evaluator,
  executionContextStack,
};
