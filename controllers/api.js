const fetchAPI = require('../models/api');

const getAPI = (req, res, next) => {
  fetchAPI()
    .then((endpoints) => {
      res.status(200).send({ endpoints });
    })
    .catch(next);
};

module.exports = getAPI;
