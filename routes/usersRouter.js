const usersRouter = require('express').Router();
const {
  getUserByUsername,
  getUsers,
  postUser,
} = require('../controllers/users');
const { send405 } = require('../controllers/errors');

usersRouter.route('/').get(getUsers).post(postUser).all(send405);
usersRouter.route('/:username').get(getUserByUsername).all(send405);

module.exports = usersRouter;
