// 只能单一符号构成
class TerminalSymbol {
  constructor(obj) {
    if (obj.groups.num) {
      // number
      this.type = "number";
      this.value = obj.groups.num;
    } else if (obj.groups.operator) {
      this.type = obj.groups.operator;
      //this.value = obj.groups.operator
    } else if (obj.groups.identifier) {
      //identifier
      this.type = "identifier";
      this.value = obj.groups.identifier;
    }
  }
}
module.exports = {
  TerminalSymbol,
};
