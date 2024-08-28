const db = require('../db/connection');
const { checkExists } = require('./utils');

exports.selectArticleById = (article_id) => {
  return db
    .query(
      'SELECT articles.author, articles.title, articles.body, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT OUTER JOIN comments ON articles.article_id = comments.article_id WHERE articles.article_id = $1 GROUP BY articles.article_id',
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: 'Article does not exist' });
      }
      return rows[0];
    });
};

exports.selectArticles = (sort_by = 'created_at', order = 'DESC', topic) => {
  let queryStr =
    'SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id) AS comment_count FROM articles LEFT OUTER JOIN comments ON articles.article_id = comments.article_id';
  const queryVals = [];
  const validColumns = [
    'article_id',
    'author',
    'title',
    'topic',
    'created_at',
    'votes',
    'comment_count',
  ];
  const validOrdering = ['ASC', 'DESC'];
  const queryPromises = [];

  if (topic) {
    queryStr += ' WHERE articles.topic = $1';
    queryVals.push(topic);
    queryPromises.push(checkExists('topics', 'slug', topic));
  }

  queryStr += ' GROUP BY articles.article_id';

  if (!validColumns.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: 'Invalid request' });
  } else {
    queryStr += ` ORDER BY ${sort_by}`;
  }

  if (!validOrdering.includes(order.toUpperCase())) {
    return Promise.reject({ status: 400, msg: 'Invalid request' });
  } else {
    queryStr += ` ${order}`;
  }

  queryPromises.push(db.query(queryStr, queryVals));
  return Promise.all(queryPromises).then((results) => {
    if (queryPromises.length === 1) {
      return results[0].rows;
    }
    return results[1].rows;
  });
};

exports.updateArticle = (article_id, reqBody) => {
  const { inc_votes } = reqBody;
  return db
    .query(
      'UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *',
      [inc_votes, article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      }
      return rows[0];
    });
};
