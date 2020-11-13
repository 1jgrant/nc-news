const fs = require('fs');

const fetchAPI = () => {
  return new Promise((resolve, reject) => {
    fs.readFile('./endpoints.json', (err, data) => {
      if (err) reject(err);
      else {
        resolve(JSON.stringify(data));
      }
    });
  });
};

module.exports = fetchAPI;
