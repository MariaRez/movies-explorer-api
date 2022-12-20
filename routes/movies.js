const router = require('express').Router();
const { getUserMovies, createMovie } = require('../controllers/movies');

router.get('/', getUserMovies); // GET /movies возвращает все сохранённые текущим  пользователем фильмы

router.post('/', createMovie); // POST /movies создаёт фильм с переданными в теле данными

module.exports = router;
