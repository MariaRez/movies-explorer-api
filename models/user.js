const validator = require('validator');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { // уникальное значение
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Почта не проходит условия валидации. Проверьте формат!',
    },
  },
  password: { //
    type: String,
    required: true,
    select: false, // Так по умолчанию хеш пароля пользователя не будет возвращаться из базы
  },
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
});

module.exports = mongoose.model('user', userSchema);
