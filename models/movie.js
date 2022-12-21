const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  country: { // страна создания фильма
    type: String,
    required: true,
  },
  director: { // режиссёр фильма
    type: String,
    required: true,
  },
  duration: { // длительность фильма
    type: Number,
    required: true,
  },
  year: { // год выпуска фильма
    type: String,
    required: true,
  },
  description: { // описание фильма
    type: String,
    required: true,
  },
  image: { // ссылка на постер к фильму
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /http[s]?:\/\/(?:www\.)?([\w-]+\.)+\/?\S*$/.test(v);
      },
      message: 'Постер к фильму не проходит условия валидации. Проверьте формат!',
    },
  },
  trailerLink: { //  ссылка на трейлер фильма
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /http[s]?:\/\/(?:www\.)?([\w-]+\.)+\/?\S*$/.test(v);
      },
      message: 'Ссылка на трейлер не проходит условия валидации. Проверьте формат!',
    },
  },
  thumbnail: { //  миниатюрное изображение постера к фильму
    type: String,
    required: true,
    validate: {
      validator(v) {
        return /http[s]?:\/\/(?:www\.)?([\w-]+\.)+\/?\S*$/.test(v);
      },
      message: 'Миниатюрное изображение постера к фильму не проходит условия валидации. Проверьте формат!',
    },
  },
  owner: { // _id пользователя, который сохранил фильм. Обязательное поле
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  nameRU: { // название фильма на русском языке. Обязательное поле-строка
    type: String,
    required: true,
  },
  nameEN: { // название фильма на английском языке. Обязательное поле-строка
    type: String,
    required: true,
  },
  movieId: { // id фильма, который содержится в ответе сервиса MoviesExplorer. Обязательное поле.
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
