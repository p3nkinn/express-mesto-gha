const CastError = require('../errors/CastError');
const InternalError = require('../errors/InternalError');
const NotFound = require('../errors/NotFound');
const modelCards = require('../models/card');

module.exports.getCard = (req, res) => {
  modelCards
    .find({})
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err) {
        res.status(CastError.status).send({ message: `Переданы некорректные данные при создании ${err.message}` });
      } else {
        res.status(InternalError.status).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.delCardById = (req, res) => {
  modelCards
    .findByIdAndRemove(req.params.cardId, { owner: req.user._id })
    .orFail(() => {
      throw new Error('Карточка не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(CastError.status)
          .send({ message: 'Карточка по указанному id не найдена.' });
      } else if (err.name === 'Error') {
        res
          .status(NotFound.status)
          .send({ message: 'Карточка по указанному id не найдена в БД.' });
      } else {
        res.status(InternalError.status).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  modelCards
    .create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(CastError.status).send({ message: `Переданы некорректные данные при создании карточки ${err.message}` });
      } else {
        res.status(InternalError.status).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  modelCards
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => {
      throw new Error('Карточка не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(CastError.status)
          .send({ message: 'Карточка по указанному id не найдена.' });
      } else if (err.name === 'NotFound') {
        res
          .status(NotFound.status)
          .send({ message: 'Карточка по указанному id не найдена в БД.' });
      } else {
        res.status(InternalError.status).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  modelCards
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => {
      throw new Error('Карточка не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(CastError.status)
          .send({ message: 'Карточка по указанному id не найдена.' });
      } else if (err.name === 'NotFound') {
        res
          .status(NotFound.status)
          .send({ message: 'Карточка по указанному id не найдена в БД.' });
      } else {
        res.status(InternalError.status).send({ message: 'Произошла ошибка' });
      }
    });
};
