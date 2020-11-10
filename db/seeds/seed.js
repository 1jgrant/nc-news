const {
  topicsData,
  articlesData,
  commentsData,
  usersData,
} = require("../data/index.js");
const {
  formatTimestamp,
  createRefObj,
  formatCommentData,
} = require("../utils/data-manipulation");

// topic -> user -> article -> comment

exports.seed = function (knex) {
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex("topics").insert(topicsData).returning("*");
    })
    .then((topicRows) => {
      return knex("users").insert(usersData).returning("*");
    })
    .then((userRows) => {
      const formattedArticles = formatTimestamp(articlesData);
      return knex("articles").insert(formattedArticles).returning("*");
    })
    .then((articleRows) => {
      const articleRef = createRefObj(articleRows, "title", "article_id");
      const formattedComments = formatCommentData(commentsData, articleRef);
      return knex("comments").insert(formattedComments).returning("*");
    });
};
