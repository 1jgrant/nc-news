const db = require("../db/connection");

const fetchArticleById = (articleId) => {
  //   if (!Number(articleId.article_id)) {
  //     return Promise.reject({
  //       status: 400,
  //       msg: "Bad Request: article_id must be a number",
  //     });
  //   }
  return db
    .select("*")
    .from("articles")
    .where(articleId)
    .returning("*")
    .then((res) => {
      if (res.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      const count = db("comments").where(articleId).count();
      return Promise.all([count, res[0]]);
    })
    .then(([count, article]) => {
      const commentCount = Number(count[0].count);
      return { ...article, comment_count: commentCount };
    });
};

module.exports = { fetchArticleById };
