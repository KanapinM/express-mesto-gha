const cards = require('express').Router();
const {
  createCardValidation,
  idValidation,
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

cards.delete('/:cardId', idValidation(), deleteCard);

cards.put('/:cardId/likes', idValidation(), likeCard);
cards.delete('/:cardId/likes', idValidation(), dislikeCard);

module.exports = cards;
