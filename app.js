const express = require('express');
const { getTopics } = require('./controllers/topics.controllers');
const { getEndpoints } = require('./controllers/endpoints.controllers');
const {
  getArticles,
  getArticleById,
  patchArticle,
} = require('./controllers/articles.controllers');
const {
  getCommentsByArticleId,
  postComment,
  deleteComment,
} = require('./controllers/comments.controllers');
const {
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require('./errors');

const app = express();

app.use(express.json());

app.get('/api', getEndpoints);
app.get('/api/topics', getTopics);
app.get('/api/articles', getArticles);
app.get('/api/articles/:article_id', getArticleById);
app.get('/api/articles/:article_id/comments', getCommentsByArticleId);
app.post('/api/articles/:article_id/comments', postComment);
app.patch('/api/articles/:article_id', patchArticle);
app.delete('/api/comments/:comment_id', deleteComment);

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
