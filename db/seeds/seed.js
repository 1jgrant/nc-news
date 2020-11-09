const {
  topicData,
  articleData,
  commentData,
  userData,
} = require("../data/index.js");

// topic -> user -> article -> comment

exports.seed = function (knex) {
  // add seeding functionality here
  return knex.migrate
    .rollback()
    .then(() => knex.migrate.latest())
    .then(() => {
      return knex("topics").insert(topicData).returning("*");
    })
    .then((topicRows) => {
      console.log(topicRows);
      return knex("users").insert(userData).returning("*");
    })
    .then((userRows) => {
      console.log(userRows);
      console.log(articleData[1]);
      //return knex("articles").insert(articleData).returning("*");
    })
    .then((articleRows) => {
      //console.log(articleRows);
    });
};
