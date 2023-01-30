/* eslint-disable import/no-unresolved */
/* eslint-disable consistent-return */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send([users]))
    .catch((err) => next(err));
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        return next(new Conflict('Пользовотель с введенным Email уже зарегестрирован.'));
      }
      next(err);
    });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
      // это может перепроверить
      return res.send({ token });
      // res
      //   .cookie('jwt', token, {
      //     maxAge: 3600000 * 24 * 7,
      //     httpOnly: true,
      //   })
      //   .send({ token });
    })
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь по указанному _id не найден.');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные при запросе данных пользователя.'));
      } else if (err.name === 'NotFound') {
        return next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
      next(err);
    });
};

module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw next(new NotFoundError('Пользователь по указанному _id не найден.'));
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные при запросе данных пользователя.'));
      } else if (err.name === 'NotFound') {
        return next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
      next(err);
    });
};

module.exports.updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: false },
  )
    .orFail(() => {
      throw next(new NotFoundError('Пользователь c указанным _id не найден.'));
    })
    .then((updateProfile) => res.send(updateProfile))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при редактировании данных пользователя.'));
      } else if (err.name === 'NotFound') {
        return next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
      next();
    });
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: false },
  )
    .orFail(() => {
      throw next(new NotFoundError('Пользователь c указанным _id не найден.'));
    })
    .then((updateAvatar) => res.send(updateAvatar))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при редактировании аватара пользователя.'));
      } else if (err.name === 'NotFound') {
        return next(new NotFoundError('Пользователь по указанному _id не найден.'));
      }
      next(err);
    });
};
