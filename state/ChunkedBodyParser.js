class ChunkedBodyParser{
  constructor() {
    let chunkLength = 0;
    const _this = this;
    const charMap = {
      0: 0,
      1: 1,
      2: 2,
      3: 3,
      4: 4,
      5: 5,
      6: 6,
      7: 7,
      8: 8,
      9: 9,
      a: 10,
      b: 11,
      c: 12,
      d: 13,
      e: 14,
      f: 15,
    };
    function readLength(char) {
      if ("\r" === char) {
        return wait_n;
      } else {
        chunkLength *= 16;
        chunkLength += charMap[char]
        return readLength;
      }
    }
    function wait_n(char) {
      if ("\n" === char) {
        return readContent;
      }
    }
    function readContent(char) {
      if (chunkLength > 0) {
        chunkLength -= 1;
        _this.emit("data",char)

        return readContent;
      } else {
        return readLength;
      }
    }
    function error(char) {
      return error
    }
    this.state = readLength;
  }
  write(data) {
    for (const char of data.toString()) {
      this.state = this.state(char);
    }
  }
}
module.exports = { ChunkedBodyParser };
