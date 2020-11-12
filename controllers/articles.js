const {
  fetchArticleById,
  updateArticleById,
  createComment,
  fetchCommentsByArticleId,
  fetchArticles,
} = require('../models/articles');

const getArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticleById = (req, res, next) => {
  updateArticleById(req.params, req.body)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

const postComment = (req, res, next) => {
  createComment(req.params, req.body)
    .then((newComment) => {
      res.status(201).send({ newComment });
    })
    .catch((err) => {
      next(err);
    });
};

const getCommentsByArticleId = (req, res, next) => {
  fetchCommentsByArticleId(req.params, req.query)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticles = (req, res, next) => {
  fetchArticles(req.query)
    .then((articles) => {
      console.log({ articles });
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getArticleById,
  patchArticleById,
  postComment,
  getCommentsByArticleId,
  getArticles,
};
