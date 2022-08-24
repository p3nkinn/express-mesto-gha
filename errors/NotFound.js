const ApplicationError = require('./ApplicationError');

const NotFound = new ApplicationError({
  message: 'Данные по указанному id не найдена в БД.',
  status: '404',
  name: 'NotFound',
});

module.exports = NotFound;
