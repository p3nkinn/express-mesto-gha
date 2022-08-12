const User = require('../models/user');

module.exports.getUser = (req, res) => {
  User.find({})
    .then(user => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports.getUserById = (req, res) => {
  User.findById(req.params.usersId)
    .then(user => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({name, about, avatar})
    .then(user => res.send({ data: user }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(req.params.usersId, { name, about })
  .then(user => res.send({ data: user }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  // обновим имя найденного по _id пользователя
  User.findByIdAndUpdate(req.params.usersId, { avatar })
  .then(user => res.send({ data: user }))
  .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}