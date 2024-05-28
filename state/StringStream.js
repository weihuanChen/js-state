const { Stream } = require("node:stream");
// 只读
class StringStream extends Stream {
  constructor(string) {
    super();
    setTimeout(() => {
      // 字符串转流
      for (const char of string) {
        this.emit("data", char);
      }
      this.emit("end");
    }, 0);
  }
}
module.exports = {
  StringStream,
};
