class BadRequest extends Error {
  constructor() {
    super(400, 'BadRequest');
  }
}
module.exports = BadRequest;
