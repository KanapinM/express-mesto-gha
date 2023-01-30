const cards = require('express').Router();
const {
  createCardValidation,
  deleteCardValidation,
  likeCardValidation,
  dislikeCardValidation,
} = require('../middlewares/validation');
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cards.get('/', getCards);
cards.post('/', createCardValidation(), createCard);

cards.delete('/:cardId', deleteCardValidation(), deleteCard);

cards.put('/:cardId/likes', likeCardValidation(), likeCard);
cards.delete('/:cardId/likes', dislikeCardValidation(), dislikeCard);

module.exports = cards;
