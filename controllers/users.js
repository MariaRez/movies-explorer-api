const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const NotFoundError = require('../errors/NotFoundError');
const User = require('../models/user');
const {
  OK,
  SALT,
  CREATED,
  DUPLICATEKEYERROR,
} = require('../utils/constants');

const { JWT_SECRET = 'dev-key' } = process.env;

module.exports.createUser = (req, res, next) => {
  // POST /signup создаёт пользователя с переданными в теле email, password и name
  bcrypt.hash(req.body.password, SALT) // хешируем пароль
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash, // записываем хеш в базу
    }))
    .then((user) => User.findOne({ _id: user._id }))
    .then((user) => res.status(CREATED).send({
      _id: user._id,
      name: user.name,
      email: user.email,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      } else if (err.code === DUPLICATEKEYERROR) {
        next(new ConflictError('Пользователь пользователь с указанными данными существует'));
      } else {
        next(err);
      }
    });
};

module.exports.login = (req, res, next) => {
  // POST /signin проверяет переданные в теле почту и пароль и возвращает JWT
  const { email, password } = req.body;
  User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign( // создание токена если была произведена успешная авторизация
        { _id: user._id },
        JWT_SECRET,
        { expiresIn: '7d' }, // токен будет просрочен через неделю после создания
      );
      res.status(OK).send({ token });
    })
    .catch(next);
};

module.exports.getInfoAboutUser = (req, res, next) => {
  // GET /users/me возвращает информацию о пользователе (email и имя)
  User.findById(req.user._id)
    .then((user) => res.status(OK).send({ data: user }))
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  // PATCH /users/me обновляет информацию о пользователе (email и имя)
  const { email, name } = req.body;
  User.findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .orFail(new NotFoundError(`Пользователь с указанным id '${req.user._id}' не найден`))
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при изменении данных пользователя'));
      } else {
        next(err);
      }
    });
};
