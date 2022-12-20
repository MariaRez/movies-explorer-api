const BadRequestError = require('../errors/BadRequestError');
const Movie = require('../models/user');
const { OK, CREATED } = require('../utils/constants');

module.exports.getUserMovies = (req, res, next) => {
  // GET /movies возвращает все сохранённые текущим  пользователем фильмы
  Movie.find(req.user._id)
    .then((movies) => res.status(OK).send({ data: movies }))
    .catch(next);
};

module.exports.createMovie = (req, res, next) => {
  // POST /movies
  // создаёт фильм с переданными в теле
  // country, director, duration, year, description, image, trailer, nameRU,
  // nameEN и thumbnail, movieId
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
  } = req.body;
  const ownerId = req.user._id;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    movieId,
    owner: ownerId,
  })
    .then((movie) => res.status(CREATED).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
// DELETE /movies/_id удаляет сохранённый фильм по id
};