const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getInfoAboutUser, updateUserInfo } = require('../controllers/users');

router.get('/me', getInfoAboutUser); // GET /users/me возвращает информацию о пользователе (email и имя)

router.patch('/me', celebrate({ // PATCH /users/me обновляет информацию о пользователе (email и имя)
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
}), updateUserInfo);

module.exports = router;
