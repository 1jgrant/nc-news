const db = require("../db/connection");

const fetchArticleById = (articleId) => {
  return db
    .select("*")
    .from("articles")
    .where(articleId)
    .returning("*")
    .then((res) => {
      const article = res[0];
      const count = db("comments")
        .where("article_id", "=", article.article_id)
        .count("article_id");
      return Promise.all([count, res[0]]);
    })
    .then(([count, article]) => {
      const commentCount = Number(count[0].count);
      return { ...article, comment_count: commentCount };
    });
};

module.exports = { fetchArticleById };
