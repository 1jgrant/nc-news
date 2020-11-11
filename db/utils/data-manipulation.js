// extract any functions you are using to manipulate your data, into this file

exports.createRefObj = (dataArray, newKey, newValue) => {
  const refObj = {};
  dataArray.forEach((dataObj) => {
    refObj[dataObj[newKey]] = dataObj[newValue];
  });
  return refObj;
};

exports.formatTimestamp = (dataArray) => {
  return dataArray.map(({ created_at, ...restOfKeys }) => {
    const date = new Date(created_at);
    restOfKeys.created_at = date;
    return restOfKeys;
  });
};

exports.formatCommentData = (comments, reference) => {
  const updatedComments = comments.map(
    ({ belongs_to, created_by, ...restOfComment }) => {
      const newComment = {
        ...restOfComment,
        article_id: reference[belongs_to],
        author: created_by,
      };
      return newComment;
    }
  );
  return this.formatTimestamp(updatedComments);
};
