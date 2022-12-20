const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUserMovies, createMovie, deleteMovie } = require('../controllers/movies');

router.get('/', getUserMovies); // GET /movies возвращает все сохранённые текущим  пользователем фильмы

router.post('/', celebrate({ // POST /movies создаёт фильм с переданными в теле данными
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.string().required(),
    year: Joi.number().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    trailerLink: Joi.string().required(),
    thumbnail: Joi.string().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    movieId: Joi.string().required(),
  }),
}), createMovie);

router.delete('/:movieId', celebrate({ // DELETE /movies/_id удаляет сохранённый фильм по id
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
}), deleteMovie);

module.exports = router;
