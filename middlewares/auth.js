/* eslint-disable import/no-unresolved */
require('dotenv').config();

const { JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  const coockieToken = req.cookies.jwt;
  console.log(coockieToken);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    if (!coockieToken) {
      throw next(new Unauthorized('Необходима авторизация'));
    }
  }

  const token = !authorization ? coockieToken : authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw next(new Unauthorized('Необходима авторизация'));
  }

  req.user = payload;

  next();
};

module.exports = auth;
