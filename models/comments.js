const db = require('../db/connection');

const updateComment = (commentId, newVotes) => {
  const inc = Number(newVotes.inc_votes)
    ? { votes: newVotes.inc_votes }
    : { votes: 1 };
  return db('comments')
    .where(commentId)
    .increment(inc)
    .returning('*')
    .then((res) => {
      if (res.length === 0) {
        return Promise.reject({ status: 404, msg: 'Comment not found' });
      }
      return res[0];
    });
};

const removeComment = (commentId) => {
  return db('comments')
    .del()
    .where(commentId)
    .then((delCount) => {
      if (delCount === 0) {
        return Promise.reject({ status: 404, msg: 'Comment not found' });
      }
    });
};

module.exports = { updateComment, removeComment };
