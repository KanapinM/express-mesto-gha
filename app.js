const express = require('express');
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const users = require('./routes/users');
const cards = require('./routes/cards');

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

mongoose.connect(env);

app.use((req, res, next) => {
  req.user = {
    _id: '63bbdda9422335ff6f72779a',
  };

  next();
});
app.use('/cards', cards);
app.use('/users', users);
app.use((req, res) => {
  res.status(404).send({ message: 'Страница по указанному маршруту не найдена' });
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
