const db = require('../db/connection');

const fetchUserByUsername = (username) => {
  return db
    .select('*')
    .from('users')
    .where(username)
    .then((res) => {
      if (res.length === 0) {
        return Promise.reject({ status: 404, msg: 'Username not found' });
      }
      return res[0];
    });
};

const fetchUsers = () => {
  return db.select('*').from('users');
};

const createUser = ({ username, avatar_url, name }) => {
  if (!username || !avatar_url || !name) {
    return Promise.reject({
      status: 400,
      msg: 'Bad request: missing required keys',
    });
  }
  const newUser = { username, avatar_url, name };
  return db('users')
    .insert(newUser)
    .returning('*')
    .then((res) => {
      return res[0];
    });
};

module.exports = { fetchUserByUsername, fetchUsers, createUser };
