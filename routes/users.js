const router = require('express').Router();
const { getInfoAboutUser, updateUserInfo } = require('../controllers/users');

router.get('/me', getInfoAboutUser); // GET /users/me возвращает информацию о пользователе (email и имя)

router.patch('/me', updateUserInfo); // PATCH /users/me обновляет информацию о пользователе (email и имя)

module.exports = router;
