const db = require("../db/connection");

const fetchUserByUsername = (username) => {
  return db
    .select("*")
    .from("users")
    .where(username)
    .returning("*")
    .then((res) => {
      return res[0];
    });
};

module.exports = { fetchUserByUsername };
