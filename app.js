const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getEndpoints } = require('./controllers/endpoints.controllers');
const {
  getArticles,
  getArticleById,
} = require('./controllers/articles.controllers');
const {
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require('./errors');

const app = express();

app.get('/api', getEndpoints);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
