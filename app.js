const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { login, createUser } = require('./controllers/users');
const { createCard } = require('./controllers/cards');
const { auth } = require('./middlewares/auth');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.post('/cards', auth, createCard);
app.post('/signin', login);
app.post('/signup', createUser);
app.use((req, res) => {
  res.status(404).send({
    message: 'Извините страница не найдена.',
  });
});

app.use((err, req, res) => {
  res.status(500).send({
    message: 'Что то сломалось.',
  });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
