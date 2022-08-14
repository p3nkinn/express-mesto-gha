const User = require("../models/user");

module.exports.getUser = (req, res) => {
  User.find({})
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      res.status(500).send({ message: `Произошла ошибка ${err}` });
    });
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.usersId)
    .orFail(() => {
      throw new Error("Пользователь не найден");
    })
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "CastError") {
        res
          .status(400)
          .send({ message: "Пользователь по указанному id не найден." });
      } else if (err.name === "Error") {
        res
          .status(404)
          .send({ message: "Пользователь по указанному id не найден в БД." });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({ message: "Переданы некорректные данные при создании" });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true }
  )
    .then((user) => res.status(200).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({
            message: " Переданы некорректные данные при обновлении профиля.",
          });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true }
  )
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res
          .status(400)
          .send({ message: "Переданы некорректные данные при создании" });
      } else {
        res.status(500).send({ message: "Произошла ошибка" });
      }
    });
};
