const cards = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

cards.get('/', getCards);
cards.post('/', createCard);

cards.delete('/:cardId', deleteCard);

cards.put('/:cardId/likes', likeCard);
cards.delete('/:cardId/likes', dislikeCard);

module.exports = cards;
