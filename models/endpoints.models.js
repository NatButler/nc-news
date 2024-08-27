const fs = require('fs/promises');

exports.fetchEndpoints = () => {
  return fs
    .readFile(`${__dirname}/../endpoints.json`, 'UTF-8')
    .then((endpointsJson) => {
      return JSON.parse(endpointsJson);
    });
};
