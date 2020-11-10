const {
  topicData,
  articleData,
  commentData,
  userData,
} = require('../data/index.js');
const {
  formatTimestamp,
  createArticleRef,
  formatCommentData,
} = require('../utils/formatting');

// topic -> user -> article -> comment

exports.seed = function (knex) {
  // add seeding functionality here
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex('topics').insert(topicData).returning('*');
    })
    .then((topicRows) => {
      // console.log(`inserted ${topicRows.length} topics`);
      return knex('users').insert(userData).returning('*');
    })
    .then((userRows) => {
      // console.log(`inserted ${userRows.length} users`);
      const formattedArticles = formatTimestamp(articleData);
      return knex('articles').insert(formattedArticles).returning('*');
    })
    .then((articleRows) => {
      // console.log(`inserted ${articleRows.length} articles`);
      //console.log(articleRows);
      const articleRef = createArticleRef(articleRows);
      const format1 = formatCommentData(commentData, articleRef);
      const formattedComments = formatTimestamp(format1);
      //console.log(formattedComments);
      return knex('comments').insert(formattedComments).returning('*');
    })
    .then((commentRows) => {
      // console.log(`inserted ${commentRows.length} comments`);
    });
};
