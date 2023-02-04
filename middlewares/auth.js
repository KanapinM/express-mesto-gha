require('dotenv').config();

// const { NODE_ENV, JWT_SECRET } = process.env;
const { JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  const JWT = req.cookies.jwt;
  let payload;

  try {
    if (!authorization || !authorization.startsWith('Bearer ')) {
      if (!JWT) { return next(new Unauthorized('Необходима авторизация')); }
    }
    const token = !authorization ? JWT : authorization.replace('Bearer ', '');
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new Unauthorized('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
module.exports = auth;
