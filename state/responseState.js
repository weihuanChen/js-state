const eventEmitter = require("events");
const { ChunkedBodyParser } = require("./ChunkedBodyParser");
const { HtmlParser } = require("./HtmlParser");
class ResponseParser extends eventEmitter {
  constructor() {
    super();
    const response = {
      currentHeaderKeyStr: "",
      currentHeaderValueStr: "",
      statusStr: "", //编码
      statusTextValueStr: "", //编码文本
      header: {},
    };
    function start(char) {
      if (char === " ") {
        return statusCode;
      } else {
        return start;
      }
    }
    function statusCode(char) {
      const numberReg = /[0-9]/g;
      if (numberReg.test(char)) {
        return statusCode;
      } else if (char === " ") {
        response.statusStr += char;
        return statusText;
      }
      return error;
    }
    function statusText(char) {
      if ("\r" === char) {
        return after_r;
      } else {
        response.statusTextValueStr += char;
        return statusText;
      }
    }
    function after_r(char) {
      if ("\n" === char) {
        return first_headerKey;
      }
    }
    function first_headerKey(char) {
      if (char === ":") {
        return waitSpace;
      } else if ("\r" === char) {
        //空行
        return emptyLine;
      } else {
        // reconsume 重用
        response.currentHeaderValueStr = "";
        response.currentHeaderKeyStr = "";
        return headerKey(char);
      }
    }
    function emptyLine(char) {
      if ("\n" === char) {
        // chunk以一个长度开头，独占一行 16进制长度
        // chunk没有字符的限制
        // 需要补充伪状态机
        // 根据Transfer-Encoding创建特定类型的解析器
        // 其他编码类型额外补充
        if (response.header["Transfer-Encoding"] === "chunked") {
          this.bodyParser = new ChunkedBodyParser();
        }
        if (response.header["Content-Type"] === "text/html") {
          this.bodyParser = new HtmlParser();
        }
        return body;
      }
    }
    function body(char) {
      this.bodyParser.write(char);
      return body;
    }
    function headerKey(char) {
      if (char === ":") {
        return waitSpace;
      } else {
        response.currentHeaderKeyStr += char;
        return headerKey;
      }
    }
    function waitSpace(char) {
      if (char === " ") {
        return headerValue;
      } else {
        // 如果多了空格，算value的一部分
        return error;
      }
    }
    function headerValue(char) {
      if (char === "\r") {
        response.header[response.currentHeaderKeyStr] =
          response.currentHeaderValueStr;
        return after_r;
      } else {
        response.currentHeaderValueStr += char;
        return headerValue;
      }
    }
    function end(char) {
      if (char === EOF) {
        return success;
      }
      return error;
    }
    function error(char) {
      return error;
    }
    function success(char) {
      return error;
    }

    this.response = response;
    this.state = start;
  }
  write(data) {
    for (const char of data.toString()) {
      // console.log("stateName:", this.state.name);
      // console.log("char:", char);
      this.state = this.state(char);
    }
  }
  end() {
    console.log("end", this.response);
  }
  receiveChar(char) {
    // console.log("stateName:", state.name);
    // console.log("char:", char);
    this.state = this.state(char);
  }
}

module.exports = { ResponseParser };
