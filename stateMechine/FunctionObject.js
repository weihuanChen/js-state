class FunctionObject {
  constructor(body) {
    this.body = body;
  }
  call(){
    return evaluate(this.body)
  }
}
