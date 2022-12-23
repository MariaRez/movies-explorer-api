const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { login, createUser } = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const NotFoundError = require('../errors/NotFoundError');
const { pageNotFoundMessage } = require('../utils/constants');

// роуты, которым авторизация нужна
router.use('/users', auth, require('./users'));
router.use('/movies', auth, require('./movies'));

router.post('/signin', celebrate({ // POST /signin проверяет переданные в теле почту и пароль и возвращает JWT
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({ // POST /signup создаёт пользователя с переданными в теле email, password и name
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.use(auth, (req, res, next) => {
  next(new NotFoundError(pageNotFoundMessage));
});

module.exports = router;
