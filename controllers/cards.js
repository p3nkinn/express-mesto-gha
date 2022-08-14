const modelCards = require('../models/card');

module.exports.getCard = (req, res) => {
  modelCards.find({})
    .then(card => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400)
          .send({ message: 'Переданы некорректные данные при создании' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

module.exports.delCardById = (req, res) => {
  modelCards.findByIdAndRemove(req.user._id)
  .orFail(() => {
    throw new Error("Карточка не найдена");
  })
  .then((card) => res.status(200).send({ data: card }))
  .catch((err) => {
    if (err.name === "CastError") {
      res
        .status(400)
        .send({ message: "Карточка по указанному id не найдена." });
    } else if (err.name === "Error") {
      res
        .status(404)
        .send({ message: "Карточка по указанному id не найдена в БД." });
    } else {
      res.status(500).send({ message: "Произошла ошибка" });
    }
  });
};

module.exports.createCard= (req, res) => {
  const { name, link } = req.body;
  modelCards.create({name, link, owner: req.user._id})
    .then(card => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400)
          .send({ message: 'Переданы некорректные данные при создании' });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
}

module.exports.likeCard = (req, res) => {
  modelCards.findByIdAndUpdate(
    req.params.cardId,
  { $addToSet: { likes: req.user._id } }, { new: true },)
  .orFail(() => {
    throw new Error("Карточка не найдена");
  })
  .then((card) => res.status(200).send({ data: card }))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(400)
          .send({ message: "Карточка по указанному id не найдена." });
      } else if (err.name === "Error") {
        res
          .status(404)
          .send({ message: "Карточка по указанному id не найдена в БД." });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
}

module.exports.dislikeCard = (req, res) => {
modelCards.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id  } }, { new: true },)
  .orFail(() => {
    throw new Error("Карточка не найдена");
  })
  .then((card) => res.status(200).send({ data: card }))
  .catch((err) => {
    if (err.name === "CastError") {
      res
        .status(400)
        .send({ message: "Карточка по указанному id не найдена." });
    } else if (err.name === "Error") {
      res
        .status(404)
        .send({ message: "Карточка по указанному id не найдена в БД." });
    } else {
      res.status(500).send({ message: "Произошла ошибка" });
    }
  });
}