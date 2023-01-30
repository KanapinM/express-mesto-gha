const users = require('express').Router();
const { updateProfileValidation, updateAvatarValidation, getUserValidation } = require('../middlewares/validation');
const {
  getUsers,
  getUser,
  getMe,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

users.get('/', getUsers);
users.get('/me', getMe);
users.get('/:userId', getUserValidation(), getUser);

users.patch('/me', updateProfileValidation(), updateProfile);
users.patch('/me/avatar', updateAvatarValidation(), updateAvatar);

module.exports = users;
