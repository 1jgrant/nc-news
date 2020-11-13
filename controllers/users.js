const {
  fetchUserByUsername,
  fetchUsers,
  createUser,
} = require('../models/users');

const getUserByUsername = (req, res, next) => {
  fetchUserByUsername(req.params)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch(next);
};

const getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.status(200).send({ users });
    })
    .catch(next);
};

const postUser = (req, res, next) => {
  createUser(req.body)
    .then((newUser) => {
      res.status(201).send({ newUser });
    })
    .catch(next);
};

module.exports = { getUserByUsername, getUsers, postUser };
