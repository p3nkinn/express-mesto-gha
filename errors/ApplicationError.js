class ApplicationError {
  constructor({ message, status, name }) {
    this.status = status;
    this.message = message;
    this.name = name;
  }
}

module.exports = ApplicationError;
