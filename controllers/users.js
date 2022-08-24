const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const CastError = require('../errors/CastError');
const InternalError = require('../errors/InternalError');
const NotFound = require('../errors/NotFound');
const User = require('../models/user');

module.exports.getUser = (req, res) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => {
      res.status(InternalError.status).send({ message: 'Произошла ошибка' });
    });
};

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res
        .cookie('jwt', token, {
        // token - наш JWT токен, который мы отправляем
          maxAge: 3600000,
          httpOnly: true,
        });
      if (!user) {
        throw new Error('Неправильные почта или пароль');
      }

      return bcrypt.compare(password, user.password);
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    })
    .then((matched) => {
      if (!matched) {
        throw new Error('Неправильные почта или пароль');
      }
      res.send({ message: 'Всё верно!' });
    })
    .catch((err) => {
      res.status(401).send({ message: err.message });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.usersId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(CastError.status).send({ message: 'Передан некорректный id' });
      } else if (err.message === 'NotFound') {
        res.status(NotFound.status).send({ message: 'Данные по указанному id не найдена в БД.' });
      } else {
        res.status(InternalError.status).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email: req.body.email,
        password: hash,
      })
        .then((user) => res.send({ data: user }))
        .catch((err) => {
          if (err.name === 'ValidationError') {
            res
              .status(CastError.status)
              .send({ message: 'Переданы некорректные данные при создании' });
          } else {
            res.status(InternalError.status).send({ message: 'Произошла ошибка' });
          }
        });
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(CastError.status).send({
          message: ' Переданы некорректные данные при обновлении профиля.',
        });
      } else {
        res.status(InternalError).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res
          .status(CastError)
          .send({ message: 'Переданы некорректные данные при создании' });
      } else {
        res.status(InternalError).send({ message: 'Произошла ошибка' });
      }
    });
};
