const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const ConflictRequest = require('../errors/ConflictRequest');
const BadRequest = require('../errors/BadRequest');
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
  User.findById(req.user._id)
    .orFail()
    .catch(() => {
      throw new NotFound('Данные по указанному id не найдена в БД.');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => next(err));
};

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new Error('NotFound');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Передан некорректный id');
      } else if (err.name === 'NotFound') {
        throw new NotFound('Данные по указанному id не найдена в БД.');
      }
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

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFound('Передан некорректный id');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest(' Переданы некорректные данные при обновлении профиля.');
      }
    })
    .catch((err) => next(err));
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail(() => {
      throw new NotFound('Передан некорректный id');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest(' Переданы некорректные данные при обновлении профиля.');
      }
    })
    .catch((err) => next(err));
};
