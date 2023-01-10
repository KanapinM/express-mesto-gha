const users = require('express').Router();
const {
  getUsers,
  createUser,
  getUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

users.get('/', getUsers);
users.post('/', createUser);

users.get('/:userId', getUser);

users.patch('/me', updateProfile);
users.patch('/me/avatar', updateAvatar);

module.exports = users;
