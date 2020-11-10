const { fetchUserByUsername } = require("../models/users");

const getUserByUsername = (req, res, next) => {
  fetchUserByUsername(req.params)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = { getUserByUsername };
