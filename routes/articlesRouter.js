const articlesRouter = require("express").Router();
const { getArticleById, patchArticleById } = require("../controllers/articles");
const { send405 } = require("../controllers/errors");

articlesRouter
  .route("/:article_id")
  .get(getArticleById)
  .patch(patchArticleById)
  .all(send405);

module.exports = articlesRouter;
