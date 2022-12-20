const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const User = require('../models/user');
const { OK } = require('../utils/constants');

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
