require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const handlerErrors = require('./middlewares/handlerErrors');
const { limiter } = require('./middlewares/rateLimiter');
const router = require('./routes');
const { serverCrashMessage } = require('./utils/constants');

const options = { // для cors настройки
  origin: [
    'http://localhost:3000',
    'https://localhost:3000',
    'http://localhost:3001',
    'https://localhost:3001',
    'http://api.mariarez.students.nomoredomains.club',
    'https://api.mariarez.students.nomoredomains.club',
    'http://mariarez.students.nomoredomainsclub.ru',
    'https://mariarez.students.nomoredomainsclub.ru',
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
    throw new Error(serverCrashMessage);
  }, 0);
});

app.use(router);

app.use(errorLogger); // подключаем логгер ошибок

app.use(errors()); // celebrate error handler
app.use(handlerErrors); // функция обработки ошибок

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
