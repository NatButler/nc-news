const db = require('../db/connection');

exports.selectCommentsByArticleId = (article_id) => {
  return db
    .query(
      'SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at DESC',
      [article_id]
    )
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: 'Not found' });
      }
      return rows;
    });
};

exports.insertComment = (article_id, reqBody) => {
  const { username, body } = reqBody;
  return db
    .query(
      'INSERT INTO comments (author, body, article_id) VALUES ($1, $2, $3) RETURNING *',
      [username, body, article_id]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeComment = (comment_id) => {
  return db
    .query('DELETE FROM comments WHERE comment_id = $1 RETURNING *', [
      comment_id,
    ])
    .then(({ rows }) => {
      if (!rows.length) {
        return Promise.reject({ status: 404, msg: 'Comment does not exist' });
      }
    });
};
