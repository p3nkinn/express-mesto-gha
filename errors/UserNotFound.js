const ApplicationError = require('./ApplicationError');

class UserNotFound extends ApplicationError {
  constructor() {
    super(404, 'User Not Found');
  }
}

module.exports = UserNotFound;
