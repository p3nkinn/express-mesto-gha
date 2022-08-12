const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use('/', require('./routes/users'));
app.use('/', require('./routes/cards'));

app.use((req, res, next) => {
  req.user = {
    _id: '62f5d7dd3746ee905d95e1ae' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.listen(PORT, () => {
  console.log('`App listening on port ${PORT}`');
})