const { fetchTopics, createTopic } = require('../models/topics');

getTopics = (req, res, next) => {
  fetchTopics()
    .then((topics) => {
      res.status(200).send({ topics });
    })
    .catch(next);
};

postTopic = (req, res, next) => {
  createTopic(req.body)
    .then((newTopic) => {
      res.status(201).send({ newTopic });
    })
    .catch(next);
};

module.exports = { getTopics, postTopic };
