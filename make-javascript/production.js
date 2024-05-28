/** 产生式规则 */
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
    ["FunctionStatement"],
    ["WhileStatement"],
    ["BrekStatement"],
    ["ContinueStatement"],
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
      ";",
    ],
    ["function", "identifier", "(", ")", "{", "StatementList", "}"],
  ],
  Method: [["identifier", "(", "Arguments", ")", "{", "StatementList", "}"]],
  MethodList: [["Method"], ["MethodList", "Method"]],
  ClassStatement: [["class", "identifier", "{", "MethodList", "}"]],
  Script: [["StatementList"], ["FunctionStatement"]],
  WhileStatement: [["while", "(", "AssignmentExpression", ")", "Statement"]],
  BrekStatement: [["break", ";"]],
  ContinueStatement: [["continue", ";"]],
};
// 起始状态
const start = {
  Script: {
    EOF: {
      $end: true,
    },
  },
};
module.exports = {
  rules,
  start,
};
