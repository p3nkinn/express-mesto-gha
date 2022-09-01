const BadRequest = require('../errors/BadRequest');
const NotFound = require('../errors/NotFound');
const ForbiddenError = require('../errors/ForbiddenError');
const modelCards = require('../models/card');

module.exports.getCard = (req, res, next) => {
  modelCards
    .find({})
    .populate('user')
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

module.exports.delCardById = (req, res, next) => {
  modelCards
    .findById(req.params.cardId)
    .orFail()
    .catch(() => {
      throw new NotFound('Карточка по указанному id не найдена в БД.');
    })
    .then((card) => {
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Невозможно удалить чужую карточку');
      }
    });
  modelCards.findByIdAndRemove(req.params.cardId)
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Передан некорректный id.');
      }
    })
    .catch((err) => next(err));
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  modelCards
    .create({ name, link, owner: req.user._id })
    .catch(() => {
      throw new BadRequest('Указаны некорректные данные при создании карточки');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

module.exports.likeCard = (req, res, next) => {
  modelCards
    .findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    )
    .orFail()
    .catch((err) => {
      if (err.name === 'BadRequest') {
        throw new BadRequest('Передан некорректный id.');
      } else if (err.message === 'NotFound') {
        throw new NotFound('Карточка по указанному id не найдена в БД.');
      }
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};

module.exports.dislikeCard = (req, res, next) => {
  modelCards
    .findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    )
    .orFail()
    .catch((err) => {
      if (err.name === 'BadRequest') {
        throw new BadRequest('Передан некорректный id.');
      } else if (err.message === 'NotFound') {
        throw new NotFound('Карточка по указанному id не найдена в БД.');
      }
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => next(err));
};
