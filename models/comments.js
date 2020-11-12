const db = require('../db/connection');

const updateComment = (articleId, newVotes) => {
  console.log(articleId);
  console.log(newVotes);
  const inc = Number(newVotes.inc_votes)
    ? { votes: newVotes.inc_votes }
    : { votes: 1 };
  return db('comments')
    .where(articleId)
    .increment(inc)
    .returning('*')
    .then((res) => {
      console.log(res);
      return res[0];
    });
};

module.exports = { updateComment };
