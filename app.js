require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors, celebrate, Joi } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { login, createUser } = require('./controllers/users');
const { auth } = require('./middlewares/auth');
const handlerErrors = require('./middlewares/handlerErrors');
const NotFoundError = require('./errors/NotFoundError');
const { limiter } = require('./middlewares/rateLimiter');

const options = { // для cors настройки
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3001',
    'http://api.mariarez.students.nomoredomains.club',
    'https://api.mariarez.students.nomoredomains.club',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

const { PORT = 3000 } = process.env;
const app = express();

app.use(helmet());

app.use(limiter);

mongoose.set('strictQuery', false);
mongoose.connect('mongodb://localhost:27017/moviesdb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use('*', cors(options));

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

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
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth, (req, res, next) => {
  next(new NotFoundError('Page Not found 404'));
});

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // celebrate error handler
app.use(handlerErrors); // функция обработки ошибок

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
