const ApplicationError = require('./ApplicationError');

const CastError = new ApplicationError({
  message: 'Передан некорректный id',
  status: '400',
  name: 'CastError',
});

module.exports = CastError;
