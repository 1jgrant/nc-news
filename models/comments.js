const db = require('../db/connection');

const updateComment = (articleId, newVotes) => {
  console.log(articleId);
  console.log(newVotes);
  return db('comments')
    .where(articleId)
    .increment({ votes: newVotes.inc_votes })
    .returning('*')
    .then((res) => {
      console.log(res);
      return res[0];
    });
};

module.exports = { updateComment };
