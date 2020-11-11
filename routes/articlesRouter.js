const articlesRouter = require('express').Router();
const {
  getArticleById,
  patchArticleById,
  postComment,
  getCommentsByArticleId,
} = require('../controllers/articles');
const { send405 } = require('../controllers/errors');

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById)
  .all(send405);

articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articlesRouter;
