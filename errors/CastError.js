const ApplicationError = require('./ApplicationError');

const InternalError = new ApplicationError({
  message: 'Передан некорректный id',
  status: '400',
  name: 'CastError',
});

module.exports = InternalError;
