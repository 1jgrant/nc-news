const topicsRouter = require('express').Router();
const { getTopics, postTopic } = require('../controllers/topics');
const { send405 } = require('../controllers/errors');

topicsRouter.route('/').get(getTopics).post(postTopic).all(send405);

module.exports = topicsRouter;
