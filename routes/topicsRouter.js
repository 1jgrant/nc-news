const topicsRouter = require("express").Router();
const { getTopics } = require("../controllers/topics");
const { send405 } = require("../controllers/errors");
topicsRouter.route("/").get(getTopics).all(send405);

module.exports = topicsRouter;
