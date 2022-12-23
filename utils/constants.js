const OK = 200;
const CREATED = 201;
const SALT = 10;
const DUPLICATEKEYERROR = 11000;
const authMessage = 'Необходима авторизация';
const incorrectDataMessage = 'Переданы некорректные данные';
const wrongDataMessage = 'Переданы неправильные данные';
const notFoundFilmMessage = 'Фильм с указанным id не найден';
const notFoundUserMessage = 'Пользователь с указанным id не найден';
const notAllowedMessage = 'Нет прав!';
const success = 'Операция произведеная успешно';
const conflictMessage = 'Пользователь пользователь с указанными данными существует';
const serverProblemMessage = 'На сервере произошла ошибка';
const imageValidateMessage = 'Постер к фильму не проходит условия валидации. Проверьте формат!';
const trailerLinkValidateMessage = 'Ссылка на трейлер не проходит условия валидации. Проверьте формат!';
const thumbnailValidateMessage = 'Миниатюрное изображение постера к фильму не проходит условия валидации. Проверьте формат!';
const emailValidateMessage = 'Почта не проходит условия валидации. Проверьте формат!';
const pageNotFoundMessage = 'Page Not found 404';
const serverCrashMessage = 'Сервер сейчас упадёт';

module.exports = {
  OK,
  CREATED,
  SALT,
  DUPLICATEKEYERROR,
  authMessage,
  incorrectDataMessage,
  wrongDataMessage,
  notFoundFilmMessage,
  notFoundUserMessage,
  notAllowedMessage,
  success,
  conflictMessage,
  serverProblemMessage,
  imageValidateMessage,
  trailerLinkValidateMessage,
  thumbnailValidateMessage,
  emailValidateMessage,
  pageNotFoundMessage,
  serverCrashMessage,
};
