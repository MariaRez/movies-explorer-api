const BadRequestError = require('../errors/BadRequestError');
const ForbiddenError = require('../errors/ForbiddenError');
const NotFoundError = require('../errors/NotFoundError');
const Movie = require('../models/movie');
const {
  OK,
  CREATED,
  incorrectDataMessage,
  notFoundFilmMessage,
  notAllowedMessage,
  success,
} = require('../utils/constants');

module.exports.getUserMovies = (req, res, next) => {
  // GET /movies возвращает все сохранённые текущим  пользователем фильмы
  const owner = req.user._id;
  Movie.find({ owner })
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
    owner: req.user._id,
  })
    .then((movie) => res.status(CREATED).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(incorrectDataMessage));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  // DELETE /movies/_id удаляет сохранённый фильм по id
  const { movieId } = req.params;
  Movie.findByIdAndRemove(movieId)
    .orFail(new NotFoundError(notFoundFilmMessage))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new ForbiddenError(notAllowedMessage));
      }
      return movie.remove()
        .then(() => res.status(OK).send({ message: success }));
    })
    .catch(next);
};
