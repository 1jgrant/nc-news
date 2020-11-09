exports.createUserRef = (userRows) => {
//   if (userRows.length == 0) return {};
  const ref = {};
  userRows.foreach((user) => {
      ref[user.username] = user.
  })
  return ref;
};
