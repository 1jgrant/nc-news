const { updateComment } = require('../models/comments');

const patchComment = (req, res, next) => {
  updateComment(req.params, req.body)
    .then((updatedComment) => {
      res.status(200).send({ updatedComment });
    })
    .catch(next);
};

module.exports = { patchComment };
