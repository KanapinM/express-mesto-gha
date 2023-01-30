/* eslint-disable import/no-unresolved */
/* eslint-disable consistent-return */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;
const BadRequest = require('../errors/BadRequest');
const Conflict = require('../errors/Conflict');
const NotFoundError = require('../errors/NotFoundError');
const Unauthorized = require('../errors/Unauthorized');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
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
    .then(() => res.send({
      data: {
        name,
        about,
        avatar,
        email,
      },
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Переданы некорректные данные при создании пользователя.'));
      } else if (err.code === 11000) {
        return next(new Conflict('Пользовотель с введенным Email уже зарегестрирован.'));
      }
      next(err);
    });
};

module.exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // return User.findUserByCredentials(email, password)
  //   .then((user) => {
  //     bcrypt.compare(password, user.password);
  //     const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  //     // это может перепроверить
  //     return res.send({ token });
  //     // res
  //     //   .cookie('jwt', token, {
  //     //     maxAge: 3600000 * 24 * 7,
  //     //     httpOnly: true,
  //     //   })
  //     //   .send({ isToken: token });
  //   })
  // .catch(next);

  try {
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      throw new Unauthorized('Не верный пользователь или пароль');
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new Unauthorized('Не верный пользователь или пароль');
    }

    if (isPasswordCorrect) {
      const token = await jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', {
        expiresIn: '7d',
      });
      res.send({ token });
    }
  } catch (err) {
    next(err);
  }
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

module.exports.getMe = async (req, res, next) => {
  // User.findById(req.user._id)
  // .orFail(() => {
  //   throw next(new NotFoundError('Пользователь по указанному _id не найден.'));
  // })
  // .then((user) => res.send(user))
  // .catch((err) => {
  //   if (err.name === 'CastError') {
  //     next(new BadRequest('Переданы некорректные данные при запросе данных пользователя.'));
  //   } else if (err.name === 'NotFound') {
  //     return next(new NotFoundError('Пользователь по указанному _id не найден.'));
  //   }
  //   next(err);
  // });

  // User.findById(req.user._id)
  //   .then((user) => {
  //     if (!user) {
  //       next(new NotFoundError('Пользователь по указанному _id не найден.'));
  //     }
  //     return User.findByIdAndRemove(req.user._id)
  //       .orFail(() => {
  //         throw new NotFoundError('Пользователь по указанному _id не найден.');
  //       })
  //       .then((user) => res.send(user))
  //       .catch((err) => {
  //         if (err.name === 'CastError') {
  // eslint-disable-next-line max-len
  //           next(new BadRequest('Переданы некорректные данные при запросе данных пользователя.'));
  //         } else if (err.name === 'NotFound') {
  //           return next(new NotFoundError('Пользователь по указанному _id не найден.'));
  //         }
  //         next(err);
  //       });
  //   });
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      throw NotFoundError('req.user._id');
    }
    return res.send(user);
  } catch (err) {
    next(err);
  }
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
