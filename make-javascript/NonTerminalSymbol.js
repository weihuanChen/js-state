// 可以被展开，可以由其他符号构成
class NonTerminalSymbol {
  constructor(type, children) {
    this.type = type;
    this.children = children;

  }
}
module.exports = {
  NonTerminalSymbol
}