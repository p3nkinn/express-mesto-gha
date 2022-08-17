const ApplicationError = require('./ApplicationError');

const InternalError = new ApplicationError({
  message: 'Что-то пошло не так',
  status: '500',
  name: 'InternalError',
});

module.exports = InternalError;
