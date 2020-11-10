const articlesRouter = require("express").Router();
const { getArticleById } = require("../controllers/articles");
const { send405 } = require("../controllers/errors");

articlesRouter.route("/:article_id").get(getArticleById).all(send405);

module.exports = articlesRouter;
