const { celebrate, Joi } = require('celebrate');
/* eslint-disable no-useless-escape */
const RegExp = /https?[\w\-\.\_\~\:\/\?\#\[\]\@\!\$\&\'\(\)\*\+\,\;\=]+/;

const signUpValidation = () => celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(RegExp),
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
    name: Joi.string().required(true).min(2).max(30),
    about: Joi.string().required(true).min(2).max(30),
  }).unknown(true),
});

const getUserValidation = () => celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required(true).hex().length(24),
  }).unknown(true),
});

const updateAvatarValidation = () => celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required(true).regex(RegExp),
  }).unknown(true),
});

const createCardValidation = () => celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(true).min(2).max(30),
    link: Joi.string().required(true).regex(RegExp),
  }).unknown(true),
});

const idValidation = () => celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(true).hex().length(24),
  }).unknown(true),
});

module.exports = {
  signInValidation,
  signUpValidation,
  updateProfileValidation,
  updateAvatarValidation,
  getUserValidation,
  createCardValidation,
  idValidation,
};
