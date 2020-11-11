const {
  fetchArticleById,
  updateArticleById,
  createComment,
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
      //console.log({ newComment });
      res.status(201).send({ newComment });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getArticleById, patchArticleById, postComment };
