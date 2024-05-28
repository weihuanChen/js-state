// 只能单一符号构成
class TerminalSymbol {
  constructor(obj) {
    if (obj.groups.num) {
      this.type = "number";
      this.value = obj.groups.num;
    } else if (obj.groups.operator) {
      this.type = obj.groups.operator;
    } else if (obj.groups.identifier) {
      this.type = "identifier";
      this.value = obj.groups.identifier;
    } else if (obj.groups.keyword) {
      this.type = obj.groups.keyword;
    }
  }
}
module.exports = {
  TerminalSymbol,
};
