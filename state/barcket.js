let treeNodeStack = [];
function isLeft(char) {
  return char === "(" || char === "[" || char === "(";
}
function isValid(str) {
  const len = str.length;
  if (len % 2 === 1) {
    return false;
  }
  // 从第一个开始
  const stack = [];
  treeNodeStack = [{ v: "root", children: [] }];
  for (let i = 0; i < len; i++) {
    let c = str[i];
    // console.log("字符", c);
    // console.log('treeStack',treeNodeStack);
    if (isLeft(c)) {
      const o = {
        v: c,
        children: [],
      };
      treeNodeStack[treeNodeStack.length - 1].children.push(o);
      treeNodeStack.push(o); // shift
      stack.push(c);
    } else {
      treeNodeStack.pop();
      let prev = stack.pop(); // 出栈 reduce
      if (
        (prev === "(" && c === ")") ||
        (prev === "[" && c === "]") ||
        (prev === "(" && c === ")")
      ) {
        console.log("match");
      } else {
        return false;
      }
    }
  }
  return stack.length === 0;
}
const str = "[()]";

console.log(isValid(str));
console.log("treeNodeStack", JSON.stringify(treeNodeStack, null, "  "));
