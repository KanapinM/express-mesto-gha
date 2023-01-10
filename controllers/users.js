const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send([users]))
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: 'Пользователь по указанному _id не найден' });
      }
      return res.send(user);
    })
    .catch((err) => res.status(500).send({ message: err.message }));
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true, upsert: false },
  )
    .orFail(() => {
      const error = new Error('Пользователь с указанным _id не найден.');
      error.name = 'NotFound';
      throw error;
    })
    .then((updateProfile) => res.send(updateProfile))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
      }
      if (err.name === 'NotFound') {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(500).send({ message: err.message });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true, upsert: false },
  )
    .orFail(() => {
      const error = new Error('Пользователь с указанным _id не найден.');
      error.name = 'NotFound';
      throw error;
    })
    .then((updateAvatar) => res.send(updateAvatar))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      if (err.name === 'NotFound') {
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      return res.status(500).send({ message: err.message });
    });
};
