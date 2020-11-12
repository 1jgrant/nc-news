const commentsRouter = require('express').Router();
const { patchComment, deleteComment } = require('../controllers/comments');
const { send405 } = require('../controllers/errors');

commentsRouter
  .route('/:comment_id')
  .patch(patchComment)
  .delete(deleteComment)
  .all(send405);

module.exports = commentsRouter;
