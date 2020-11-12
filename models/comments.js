const db = require('../db/connection');

const updateComment = (articleId, newVotes) => {
  const inc = Number(newVotes.inc_votes)
    ? { votes: newVotes.inc_votes }
    : { votes: 1 };
  return db('comments')
    .where(articleId)
    .increment(inc)
    .returning('*')
    .then((res) => {
      if (res.length === 0) {
        return Promise.reject({ status: 404, msg: 'Comment not found' });
      }
      return res[0];
    });
};

module.exports = { updateComment };
