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
    avatar: Joi.string().uri({
      scheme: [
        'http',
        'https',
      ],
    })
      .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
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
    name: Joi.string().min(2).max(30).default('Жак-Ив Кусто'),
    about: Joi.string().min(2).max(30).default('Исследователь'),
  }).unknown(true),
});

const getUserValidation = () => celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }).unknown(true),
});

const updateAvatarValidation = () => celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().uri({
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
    link: Joi.string().required(true).regex(/https?[\w\W]/),
  }).unknown(true),
});

const deleteCardValidation = () => celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }).unknown(true),
});

const likeCardValidation = () => celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }).unknown(true),
});

const dislikeCardValidation = () => celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().hex().length(24),
  }).unknown(true),
});

module.exports = {
  signInValidation,
  signUpValidation,
  updateProfileValidation,
  updateAvatarValidation,
  getUserValidation,
  createCardValidation,
  deleteCardValidation,
  likeCardValidation,
  dislikeCardValidation,

};
