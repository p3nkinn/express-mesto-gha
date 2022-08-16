class BadRequest extends Error {
  constructor(message, ...rest) {
    super(...rest);
    this.status = 400;
    this.message = message;
  }
}
module.exports = BadRequest;
