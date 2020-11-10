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
  // add seeding functionality here
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex("topics").insert(topicsData).returning("*");
    })
    .then((topicRows) => {
      console.log(`inserted ${topicRows.length} topics`);
      return knex("users").insert(usersData).returning("*");
    })
    .then((userRows) => {
      console.log(`inserted ${userRows.length} users`);
      const formattedArticles = formatTimestamp(articlesData);
      return knex("articles").insert(formattedArticles).returning("*");
    })
    .then((articleRows) => {
      console.log(`inserted ${articleRows.length} articles`);
      //console.log(articleRows);
      // const articleRef = createArticleRef(articleRows);
      const articleRef = createRefObj(articleRows, "title", "article_id");
      const format1 = formatCommentData(commentsData, articleRef);
      const formattedComments = formatTimestamp(format1);
      //console.log(formattedComments);
      return knex("comments").insert(formattedComments).returning("*");
    })
    .then((commentRows) => {
      //console.log(commentRows[0]);
      console.log(`inserted ${commentRows.length} comments`);
    });
};
