function start(ch) {
  if (ch === `'`) {
    return singleQuatation
  }else if (ch === `"`) {
    return dobleQuotation    
  }else{
    return error
  }
}
/** @description 单引号 */
function singleQuatation(ch) {
  const reg = /[0-9a-zA-Z"]/g
  if (reg.test(ch)) {
    return singleQuatation
  }else if (ch === `\\`) {
    return tarnsferMeaning1
  }
  return error
}
/** @description 双引号 */
function doubleQuatation(ch) {
  const reg = /[0-9a-zA-Z']/;
  if (reg.test(ch)) {
    return doubleQuatation;
  } else if (ch === `\\`) {
    return tarnsferMeaning2;
  } else if (ch === `"`) {
    return end;
  }
  return error;
}
/**@description 转义 */
function tarnsferMeaning1(ch) {
  return singleQuatation
}
function tarnsferMeaning2(ch) {
  return doubleQuatation
}
function error(ch) {
  return error
}
const testList = [
  `'123'`,
  `"123"`,
  
]