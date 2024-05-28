/** 解析 */
const { rules } = require("./production");
// 求closure
const dictionary = new Map();
const run = function (state) {
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
};
module.exports = { run };
