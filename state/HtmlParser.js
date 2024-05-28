const { error } = require("node:console");
const { Stream } = require("node:stream");
class HtmlParser extends Stream {
  constructor() {
    super();
    let currentToken = {
      // type: "", // openTag,closeTag,selfCloseingTag,text
      // attributes: {},
      // tagName: "",
      // isClose:false, //是否关闭
    };
    let currentAttrKey = "";
    let currentAttrValue = "";
    // let currentTagName = "";
    const _this = this;
    function emit(token) {
      _this.onData(token);

      //使用EventEmitter提交
      // _this.emit("data", token);
    }
    function start(char) {
      if (char === "<") {
        currentToken = {
          type: "",
          attributes: {},
          tagName: "",
          isClose:false
        };
        currentAttrKey = ""
        currentAttrValue = ""
        return openTag;
      } else {
        // 非开标签，为文本节点
        emit({
          type: "text",
          value: char,
        });
        return start;
      }
    }
    // 开始标签
    function openTag(char) {
      if (/[0-9a-zA-Z_]/g.test(char)) {
        currentToken.type = "openTag";
        return tagName(char); //重用
      } else if (char === "/") {
        currentToken.isClose = true;
        return closeTag;
      }
    }
    // 标签名
    function tagName(char) {
      if (/[0-9a-zA-Z_]/g.test(char)) {
        currentToken.tagName += char;
        return tagName;
      } else if (char === " " || char === "\t") {
        return beforeAttribute;
      }else if (char === ">") {
        emit(currentToken);
        return start;
      } else {
        return error;
      }
    }
    // 从哪个字符进?
    function beforeAttribute(char) {
      if (/[0-9a-zA-Z_]/g.test(char)) {
        currentAttrKey += char;
        return attributesName;
      } else if (char === " " || char === "\t") {
        currentAttrKey = "";
        currentAttrValue = "";
        return beforeAttribute;
      } else if (char === "/") {
        //需要处理自封闭
        currentToken.type = "selfCloseingTag";
        return selfCLoseTag;
      } else if (char === ">") {
        currentToken.tagName += char;
        emit(currentToken);
        return start;
      } else {
        return error;
      }
    }
    function selfCLoseTag(char) {
      if (char === ">") {
        currentToken.type = "selfCloseingTag";
        currentToken.isClose = true;
        emit(currentToken);
        return start;
      } else {
        return error;
      }
    }
    // 结束标签
    function closeTag(char) {
      if (char === ">") {
        // currentToken.type = 'closeTag'
        emit(currentToken);
        return start;
      } else if (/[0-9a-zA-Z_]/g.test(char)) {
        currentToken.tagName += char;
        return closeTag;
      } else {
        return error;
      }
    }
    // 属性名称
    function attributesName(char) {
      if (/[0-9a-zA-Z_]/g.test(char)) {
        currentAttrKey += char;
        return attributesName;
      } else if (char === "=") {
        return beforeAttributesValue;
      }
    }
    function beforeAttributesValue(char) {
      if (char === `"`) {
        return doubleQuoted;
      } else if (char === `'`) {
        return singleQuoted;
      } else {
        return error;
      }
    }
    function doubleQuoted(char) {
      if (/[0-9a-zA-Z_:;]/g.test(char)) {
        currentAttrValue += char;
        return doubleQuoted;
      } else if (char === `"`) {
        currentToken.attributes[currentAttrKey] = currentAttrValue;
        currentAttrKey = "";
        currentAttrValue = "";
        if (!currentToken.isClose) {
          emit(currentToken);
        }
        return afterValue;
      } else {
        return error;
      }
    }
    function singleQuoted(char) {
      if (/[0-9a-zA-Z_:;]/g.test(char)) {
        currentAttrValue += char;
        return singleQuoted;
      } else if (char === `'`) {
        currentToken.attributes[currentAttrKey] = currentAttrValue;
        currentAttrKey = "";
        currentAttrValue = "";
        if (!currentToken.isClose) {
          emit(currentToken);
        }
        return afterValue;
      } else {
        return error;
      }
    }
    function afterValue(char) {
      if (char === " ") {
        return beforeAttribute;
      } else if (char === ">") {
        emit(currentToken);
        return start;
      } else {
        return error;
      }
    }
    function error(char) {
      return error;
    }
    this.state = start;
  }
  write(data) {
    for (const char of data.toString()) {
      // console.log("stateName", this.state.name);
      // console.log("charName:", char);
      this.state = this.state(char);
      if (this.state === error) {
        throw new Error('parse error')
      }
    }
  }
  end() {
    this.emit("end");
  }
}
module.exports = {
  HtmlParser,
};
