const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const { auth } = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const NotFoundError = require('./errors/NotFoundError');
const handlerErrors = require('./middlewares/handlerErrors');

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/moviesdb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// роуты, которым авторизация нужна
app.use('/users', auth, require('./routes/users'));
app.use('/movies', auth, require('./routes/movies'));

app.post('/signin', celebrate({ // POST /signin проверяет переданные в теле почту и пароль и возвращает JWT
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({ // POST /signup создаёт пользователя с переданными в теле email, password и name
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth, (req, res, next) => {
  next(new NotFoundError('Page Not found 404'));
});

app.use(errors()); // celebrate error handler
app.use(handlerErrors); // функция обработки ошибок

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
