const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ConflictRequest = require('../errors/ConflictRequest');
const CastError = require('../errors/BadRequest');
const InternalError = require('../errors/InternalError');
const NotFound = require('../errors/NotFound');
const User = require('../models/user');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.send({ token });
      res
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        }).end();
    })
    .catch((err) => next(err));
};

module.exports.getUser = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};

module.exports.getCurrentUser = (req, res, next) => {
  User.findById(req.params._id)
    .orFail()
    .catch(() => {
      throw new NotFound('Данные по указанному id не найдена в БД.');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.usersId)
    .orFail()
    .catch(() => {
      throw new NotFound('Данные по указанному id не найдена в БД.');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .catch((err) => {
          console.log(err);
          if (err.name === 'ConflictError' || err.code === 11000) {
            throw new ConflictRequest('Пользователь с таким email уже зарегистрирован');
          } else {
            next(err);
          }
        })
        .then((user) => res.send({
          data: {
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
          },
        }))
        .catch((err) => next(err));
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
