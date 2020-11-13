const db = require('../db/connection');

const fetchTopics = () => {
  return db.select('*').from('topics');
};

const createTopic = ({ slug, description }) => {
  if (!slug || !description) {
    return Promise.reject({
      status: 400,
      msg: 'Bad request: missing required keys',
    });
  }
  const newTopic = { slug, description };
  return db('topics')
    .insert(newTopic)
    .returning('*')
    .then((res) => {
      return res[0];
    });
};

module.exports = { fetchTopics, createTopic };
