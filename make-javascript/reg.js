let regxStr = `(?<num>([1-9]\\d+)|[0-9])
    (?<operator>===|!==[+\\-*\\/=;,()[]<>])
    (?<keyword>(if|return|function|class|let|const|var|break|continue|while)(?![a-zA-Z]))
    (?<identifier>(\\w[a-zA-Z0-9]+)|\\w)
    (?<whitespace> )`;
regxStr = regxStr
  .split("\n")
  .map((item) => item.trim())
  .join("|");
const regx = new RegExp(regxStr, "g");

module.exports = { regx };
