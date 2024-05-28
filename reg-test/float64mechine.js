//check if ainteger is 10 digits

/**
 *
 * @param {*} char 单个字符
 * @description 状态机开始
 * 1.0
 * 2.1 - 9
 * 3 浮点数
 * @returns 返回下一个状态
 */
function start(char) {
  const charCode = char.charCodeAt(0);
  if (charCode === "0".charCodeAt(0)) {
    //return new state
    return afterZero;
  } else if (charCode === ".".charCodeAt(0)) {
    //跟点
    return afterDot;
  } else if (charCode >= "1".charCodeAt(0) && charCode <= "9".charCodeAt(0)) {
    // return new state
    return after1To9;
  } else {
    //non-number
    return error;
  }
  //return next state
  return start;
}
/**
 *
 * @param {*} char
 * @description 0之后可以跟小数点的状态
 */
function afterZero(char) {
  if (char === EOF) {
    return success;
  } else if (char.charCodeAt(0) === ".".charCodeAt(0)) {
    return after0Dot;
  } else {
    return error;
  }
}
function afterDot(char) {
  const charCode = char.charCodeAt(0);
  if (charCode === EOF) {
    return error;
  } else if (charCode >= "0".charCodeAt(0) && charCode <= "9".charCodeAt(0)) {
    return after0Dot;
  } else {
    //.a
    return error;
  }
}
function after0Dot(charCode) {
  // const charCode = char.charCodeAt(0);
  if (charCode === EOF) {
    return success;
  } else if (charCode >= "0".charCodeAt(0) && charCode <= "9".charCodeAt(0)) {
    return after0Dot;
  } else {
    //0.. || 0.a
    return error;
  }
}
/**
 *
 * @description 后续跟任意数字都是合法的
 */
function after1To9(char) {
  const charCode = char.charCodeAt(0);
  if (charCode === EOF) {
    return success
  } else
  if (charCode >= "1".charCodeAt(0) && charCode <= "9".charCodeAt(0)) {
    // return new state
    return after1To9;
  } else if (charCode === ".".charCodeAt(0)) {
    //0
    return after0Dot;
  } 
  return error;
}
function error() {
  return error;
}

function success(params) {
  return error;
}
const EOF = Symbol("EOF");
const str = "1.2";
let state = null;
state = start;
function test(str) {
  for (const char of str) {
    console.log("输入字符", char);
    console.log("状态名", state.name);
    state = state(char);
  }
  state = state(EOF);
  return state !== error;
}
test(str);
//console.log(state.name);
