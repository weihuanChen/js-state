class Refernece {
  constructor(env, name) {
    this.name = name;
    this.env = env;
  }
  get() {
    // return this.name
    return this.env.get(this.name);
  }
  set(v) {
    this.env.set(this.name, v);
  }
}

module.exports = {
  Refernece,
};
