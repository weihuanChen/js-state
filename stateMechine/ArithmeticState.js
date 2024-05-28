// 四则运算 状态机
class ArithmeticState {
  constructor() {
    let o = {
      type: "number",
      value: "",
    };
    const _this = this;
    function emit(token) {
      console.log('token',token);
      _this.onData(token);
    }
    function start(c) {
      if (typeof Number(c) === "number") {
        return startNum(c);
      } else if (
        c === "+" ||
        c === "-" ||
        c === "*" ||
        c === "/" ||
        c === "%"
      ) {
        return startOperator(c);
      } else {
        return start;
      }
    }
    /** @description number状态 */
    function startNum(c) {
      const charCode = c.charCodeAt(0);
      if (charCode === "0".charCodeAt(0)) {
        // 0开头
        return afterZero(c);
      } else if (charCode === ".".charCodeAt(0)) {
        // . 开头
        return afterDot;
      } else if (
        charCode >= "1".charCodeAt(0) &&
        charCode <= "9".charCodeAt(0)
      ) {
        // return new state
        return after1To9;
      } else {
        //non-number
        return error;
      }
    }
    /**
     *
     * @param {*} char
     * @description 0之后可以跟小数点的状态
     */
    function afterZero(c) {
      if (c.charCodeAt(0) === ".".charCodeAt(0)) {
        return after0Dot;
      } else {
        return error;
      }
    }
    function afterDot(c) {
      const charCode = c.charCodeAt(0);
      if (charCode >= "0".charCodeAt(0) && charCode <= "9".charCodeAt(0)) {
        o.value = c;
        o.type = "number";
        emit(o)
        return after0Dot;
      } else {
        //.a
        return error;
      }
    }
    function after0Dot(c) {
      if (c >= "0".charCodeAt(0) && c <= "9".charCodeAt(0)) {
        o.value = c;
        o.type = "number";
        emit(o)
        return after0Dot;
      } else {
        //0.. || 0.a
        return error;
      }
    }
    /**
     *
     * @description 后续跟任意数字都是合法的
     */
    function after1To9(c) {
      const charCode = c.charCodeAt(0);
      console.log(charCode);
      console.log(c);
      if (charCode >= "1".charCodeAt(0) && charCode <= "9".charCodeAt(0)) {
        o.value = c
        o.type = 'number'
        emit(o)
        // return new state
        return after1To9;
      } else if (charCode === ".".charCodeAt(0)) {
        //0
        return after0Dot;
      }
      return error;
    }
    /**
     * @description 符号状态
     */
    function startOperator(c) {
      o.type = c;
      o.value = c;
      emit(o)
      return success;
    }
    function error() {
      return error;
    }

    function success() {
      return error;
    }

    this.state = start;
    this.o = o;
  }
  write(data) {
    for (const char of data.toString()) {
      // console.log('char',char);
      // console.log('name',this.state.name);
      this.state = this.state(char);
    }
  }
  end() {
    console.log("end", this.o);
  }
}
module.exports = {
  ArithmeticState
}