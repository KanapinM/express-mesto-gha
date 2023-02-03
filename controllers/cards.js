const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const Forbidden = require('../errors/Forbidden');
const NotFoundError = require('../errors/NotFoundError');

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send([cards]))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user })
    .then((card) => res.status(201).send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequest(err.message));
      }
      next(err);
    });
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .populate('owner')
    .then((card) => {
      const potentialUserId = req.user._id;
      const ownerUserId = card ? card.owner._id.toString() : false;

      if (!card) {
        return next(new NotFoundError('Карточка с указанным _id не найдена.'));
      } if (potentialUserId !== ownerUserId) {
        return next(new Forbidden('Вы не являетесь владельцем карточки.'));
      }
      return Card.remove(card)
        .orFail(() => {
          next(new NotFoundError('Карточка с указанным _id не найдена.'));
        })
        .then(() => res.send({ massage: 'Карточка удалена' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для удаления карточки.'));
      }
      next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(() => {
      next(new NotFoundError('Передан несуществующий _id карточки.'));
    })
    .then((likeCard) => res.send({ likeCard }))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Переданы некорректные данные для постановки лайка.'));
      }
      next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail(() => {
      next(new NotFoundError('Передан несуществующий _id карточки.'));
    })
    .then((dislikeCard) => res.send({ dislikeCard }))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequest('Переданы некорректные данные для снятия лайка.'));
      }
      next(err);
    });
};
