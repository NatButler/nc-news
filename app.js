const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');

const app = express();

app.get('/api/topics', getTopics);

app.use((err, req, res, next) => {
  console.log(err);
  next(err);
});

module.exports = app;
