/* eslint-disable import/no-unresolved */
require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;
const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  let payload;

  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new Unauthorized('Необходима авторизация');
    }

    const token = authorization.replace('Bearer ', '');
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
  } catch (err) {
    next(err);
  }

  req.user = payload;

  next();
};

module.exports = auth;
