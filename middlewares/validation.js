const { celebrate, Joi } = require('celebrate');

const signUpValidation = () => celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
    // avatar: Joi
    //   .string()
    //   .min(2)
    //   .max(30)
    //   .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
    avatar: Joi.string().required(true).uri({
      scheme: [
        'http',
        'https',
      ],
    }),
    email: Joi.string().required(true).email(),
    password: Joi.string().required(true).min(6),
  }).unknown(true),
});

const signInValidation = () => celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(true).email(),
    password: Joi.string().required(true).min(6),
  }).unknown(true),
});

const updateProfileValidation = () => celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }).unknown(true),
});

const updateAvatarValidation = () => celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(true).uri({
      scheme: [
        'http',
        'https',
      ],
    }),
  }).unknown(true),
});

const createCardValidation = () => celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(true).min(2).max(30),
    link: Joi.string().required(true).uri(),
  }).unknown(true),
});

module.exports = {
  signInValidation,
  signUpValidation,
  updateProfileValidation,
  updateAvatarValidation,
  createCardValidation,
};
