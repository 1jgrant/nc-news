const articles = require("../controllers/articles");
const db = require("../db/connection");

const fetchArticleById = (articleId) => {
  //   if (!Number(articleId.article_id)) {
  //     return Promise.reject({
  //       status: 400,
  //       msg: "Bad Request: article_id must be a number",
  //     });
  //   }
  return db
    .select("articles.*")
    .from("articles")
    .where("articles.article_id", "=", articleId.article_id)
    .count({ comment_count: "comment_id" })
    .leftJoin("comments", "articles.article_id", "comments.article_id")
    .groupBy("articles.article_id")
    .returning("*")
    .then((res) => {
      if (res.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      // knex count returns string, convert count to a number
      res[0].comment_count = Number(res[0].comment_count);
      return res[0];
    });
};

module.exports = { fetchArticleById };
