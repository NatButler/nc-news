const express = require('express');
const apiRouter = require('./routes/api-router');
const {
  psqlErrorHandler,
  customErrorHandler,
  serverErrorHandler,
} = require('./errors');

const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.use(psqlErrorHandler);
app.use(customErrorHandler);
app.use(serverErrorHandler);

module.exports = app;
