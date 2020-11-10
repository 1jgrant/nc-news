const db = require("../db/connection");

exports.fetchTopics = () => {
  return db.select("*").from("topics");
};
