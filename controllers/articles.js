const {
  fetchArticleById,
  updateArticleById,
  createComment,
  fetchCommentsByArticleId,
  fetchArticles,
  createArticle,
  removeArticle,
} = require('../models/articles');

const getArticleById = (req, res, next) => {
  fetchArticleById(req.params)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

const patchArticleById = (req, res, next) => {
  updateArticleById(req.params, req.body)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};

const postComment = (req, res, next) => {
  createComment(req.params, req.body)
    .then((newComment) => {
      res.status(201).send({ newComment });
    })
    .catch(next);
};

const getCommentsByArticleId = (req, res, next) => {
  fetchCommentsByArticleId(req.params, req.query)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

const getArticles = (req, res, next) => {
  fetchArticles(req.query)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};

const postArticle = (req, res, next) => {
  createArticle(req.body)
    .then((newArticle) => {
      res.status(201).send({ newArticle });
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
  removeArticle(req.params)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};

module.exports = {
  getArticleById,
  patchArticleById,
  postComment,
  getCommentsByArticleId,
  getArticles,
  postArticle,
  deleteArticle,
};
