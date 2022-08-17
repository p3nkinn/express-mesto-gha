const ApplicationError = require('./ApplicationError');

const NotFound = new ApplicationError({
  message: 'Карточка по указанному id не найдена в БД.',
  status: '404',
  name: 'notFound',
});

module.exports = NotFound;
