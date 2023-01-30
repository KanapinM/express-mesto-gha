/* eslint-disable import/no-unresolved */
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { signInValidation, signUpValidation } = require('./middlewares/validation');
const auth = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');

const NotFoundError = require('./errors/NotFoundError');

const { PORT = 3000 } = process.env;
const env = 'mongodb://localhost:27017/mestodb';
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use(helmet());

app.disable('x-powered-by');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
mongoose.connect(env);

app.post('/signin', signInValidation(), login);
app.post('/signup', signUpValidation(), createUser);
app.use(auth);

app.use('/cards', cards);
app.use('/users', users);
app.use((req, res, next) => {
  next(new NotFoundError('Страница по указанному маршруту не найдена'));
});
app.use(errors());
app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      // проверяем статус и выставляем сообщение в зависимости от него
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });

  next();
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
