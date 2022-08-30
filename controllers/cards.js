const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const modelCards = require('../models/card');

module.exports.getCard = (req, res, next) => {
  modelCards
    .find({})
    .populate('owner')
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

module.exports.delCardById = (req, res, next) => {
  modelCards
    .findByIdAndRemove(req.params.cardId, { owner: req.user._id })
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Передан некорректный id.');
      } else if (err.message === 'NotFound') {
        throw new NotFound('Карточка по указанному id не найдена в БД.');
      }
    })
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  modelCards
    .create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      throw new BadRequest({ message: `Указаны некорректные данные при создании карточки: ${err.message}` });
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  modelCards
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Передан некорректный id.');
      } else if (err.message === 'NotFound') {
        throw new NotFound('Карточка по указанному id не найдена в БД.');
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  modelCards
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail(() => {
      throw new Error('NotFound');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Передан некорректный id.');
      } else if (err.message === 'NotFound') {
        throw new NotFound('Карточка по указанному id не найдена в БД.');
      }
    })
    .catch(next);
};
