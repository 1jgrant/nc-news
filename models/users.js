const db = require('../db/connection');

const fetchUserByUsername = (username) => {
  return db
    .select('*')
    .from('users')
    .where(username)
    .returning('*')
    .then((res) => {
      if (res.length === 0) {
        return Promise.reject({ status: 404, msg: 'Username not found' });
      }
      return res[0];
    });
};

module.exports = { fetchUserByUsername };
