const db = require("../db/connection");

const fetchArticleById = (articleId) => {
  return db
    .select("*")
    .from("articles")
    .where(articleId)
    .returning("*")
    .then((res) => {
      const article = res[0];
      const commentCount = db
        .select("*")
        .from("comments")
        .where("article_id", "=", article.article_id)
        .returning("*")
        .then((res) => {
          return res.length;
        });
      return Promise.all([commentCount, article]);
    })
    .then(([commentCount, article]) => {
      return { ...article, comment_count: commentCount };
    });
};

module.exports = { fetchArticleById };
