require('dotenv').config();

const { JWT_SECRET } = process.env;
// const { NODE_ENV, JWT_SECRET } = process.env;

const jwt = require('jsonwebtoken');
const Unauthorized = require('../errors/Unauthorized');

// const auth = (req, res, next) => {
//   const { authorization } = req.headers;
//   let payload;

//   try {
//     if (!authorization || !authorization.startsWith('Bearer ')) {
//       next(new Unauthorized('Необходима авторизация'));
//     }

//     const token = authorization.replace('Bearer ', '');
//     payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
//   } catch (err) {
//     next(new Unauthorized('Необходима авторизация'));
//   }

//   req.user = payload;

//   return next();
// };

// const auth = (req, res, next) => {
//   const { authorization } = req.headers;
//   const cookiesJWT = req.cookies.jwt;
//   let payload;

//   try {
//     if (!authorization || !authorization.startsWith('Bearer ')) {
//       if (!cookiesJWT) { next(new Unauthorized('Необходима авторизация')); }
//     }

//     const token = !authorization ? cookiesJWT : authorization.replace('Bearer ', '');
//     payload = jwt.verify(token, JWT_SECRET);
//   } catch (err) {
//     next(new Unauthorized('Необходима авторизация'));
//   }

//   req.user = payload;

//   return next();
// };

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  const cookiesJWT = req.cookies.jwt;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    if (!cookiesJWT) { throw next(new Unauthorized('Необходима авторизация')); }
  }
  const token = !authorization ? cookiesJWT : authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new Unauthorized('Необходима авторизация'));
  }

  req.user = payload;

  return next();
};
module.exports = auth;
