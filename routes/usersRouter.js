const usersRouter = require("express").Router();
const { getUserByUsername } = require("../controllers/users");
const { send405 } = require("../controllers/errors");

usersRouter.route("/:username").get(getUserByUsername).all(send405);

module.exports = usersRouter;
