//check if ainteger is 10 digits

/**
 *
 * @param {*} char 单个字符
 * @description 状态机开始
 * 1.0
 * 2.1 - 9
 * 
 * @returns 返回下一个状态
 */
function start(char) {
  const charCode = char.charCodeAt(0);
  if (charCode === "0".charCodeAt(0)) {
    //return new state
    return afterZero;
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
 * @description 0之后不能有任何字符，返回error
 */
function afterZero() {
  return error;
}
/**
 *
 * @description 后续跟任意数字都是合法的
 */
function after1To9(char) {
  const charCode = char.charCodeAt(0);
  if (charCode >= "1".charCodeAt(0) && charCode <= "9".charCodeAt(0)) {
    // return new state
    return after1To9;
  }
  return error;
}
function error() {
  return error;
}

function success(params) {
  return error;
}
const EOF = Symbol('EOF')
const str = '1111'
let state = null
state = start
function test(str) {
  for (const char of str) {
    state = state(char)
    console.log('输入字符',char);
    console.log('状态名',state.name);
  }
  state = state(EOF)
  return state !== error
}
test(str)
//console.log(state.name);