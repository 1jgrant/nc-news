const articlesRouter = require('express').Router();
const {
  getArticleById,
  patchArticleById,
  postComment,
  getCommentsByArticleId,
  getArticles,
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
  .post(postComment)
  .all(send405);

articlesRouter.route('/').get(getArticles);

module.exports = articlesRouter;
