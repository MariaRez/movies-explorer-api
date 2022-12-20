const router = require('express').Router();
const { getUserMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getUserMovies); // GET /movies возвращает все сохранённые текущим  пользователем фильмы

router.post('/', createMovie); // POST /movies создаёт фильм с переданными в теле данными

router.delete('/:movieId', deleteMovie); // DELETE /movies/_id удаляет сохранённый фильм по id

module.exports = router;
