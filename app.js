const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getEndpoints } = require('./controllers/endpoints.controllers');

const app = express();

app.get('/api', getEndpoints);
app.get('/api/topics', getTopics);

app.use((err, req, res, next) => {
  console.log(err);
  next(err);
});

module.exports = app;
