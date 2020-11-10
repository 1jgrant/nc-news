// extract any functions you are using to manipulate your data, into this file

exports.createRefObj = (dataArray, newKey, newValue) => {
  const refObj = {};
  dataArray.forEach((dataObj) => {
    refObj[dataObj[newKey]] = dataObj[newValue];
  });
  return refObj;
};

exports.formatTimestamp = (rows) => {
  return rows.map(({ created_at, ...restOfKeys }) => {
    const date = new Date(created_at);
    const dateStr = date.toISOString();
    //const newCreated_at = `${dateStr.slice(0, 10)} ${dateStr.slice(11)}`;
    const newArticle = { ...restOfKeys, created_at: dateStr };
    return newArticle;
  });
};

exports.formatCommentData = (comments, reference) => {
  return comments.map(({ belongs_to, created_by, ...restOfComment }) => {
    const newComment = {
      ...restOfComment,
      article_id: reference[belongs_to],
      author: created_by,
    };
    return newComment;
  });
};
