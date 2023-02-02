/* eslint-disable no-useless-escape */
const RegExp = /https?[\w\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]+/;
const mongoose = require('mongoose');
const validator = require('validator');
// const bcrypt = require('bcryptjs');
// const Unauthorized = require('../errors/Unauthorized');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    required: false,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    required: false,
    // validate: {
    //   validator: (v) => validator.isURL(v),
    //   message: 'Некорректный URL',
    // },
    match: [RegExp, 'Некорректный URL'],
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Некорректный Email',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

// TODO: use findUserByCredentials.
// userSchema.statics.findUserByCredentials = function (email, password, next) {
//   return this.findOne({ email }).select('+password')
//     .then((user) => {
//       if (!user) {
//         throw new Unauthorized('Неправильные почта или пароль');
//       }

//       return bcrypt.compare(password, user.password)
//         .then((matched) => {
//           if (!matched) {
//             throw new Unauthorized('Неправильные почта или пароль');
//           }

//           return user;
//         });
//     })
//     .catch(next);
// };

module.exports = mongoose.model('user', userSchema);
