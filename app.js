const express = require("express");
const mongoose = require("mongoose");

const bodyParser = require("body-parser");

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use((req, res, next) => {
  req.user = {
    _id: "62f94cac09ce15b5df1c49a2", // вставьте сюда _id созданного в предыдущем пункте пользователя
  };
  next();
});

app.use("/", require("./routes/users"));
app.use("/", require("./routes/cards"));

app.use(function (req, res, next) {
  res.status(404).send("Извините страница не найдена!");
});

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

app.listen(PORT, () => {
  console.log("`App listening on port ${PORT}`");
});
