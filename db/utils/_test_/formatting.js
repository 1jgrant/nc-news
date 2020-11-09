exports.createUserRef = (userRows) => {
  //   if (userRows.length == 0) return {};
  const ref = {};
  userRows.foreach((user) => {
    //ref[user.username] = user.
  });
  return ref;
};

exports.formatTimestamp = (rows) => {
  return rows.map(({ created_at, ...restOfKeys }) => {
    const ms = Math.round(created_at / 1000) * 1000;
    const date = new Date(ms);
    const dateStr = date.toISOString().slice(0, -5);
    const newCreated_at = `${dateStr.slice(0, 10)} ${dateStr.slice(11)}`;
    const newArticle = { ...restOfKeys, created_at: newCreated_at };
    return newArticle;
  });
};
