const articlesRouter = require('express').Router();
const {
  getArticles,
  getArticleById,
  patchArticle,
} = require('../controllers/articles.controllers');
const {
  getCommentsByArticleId,
  postComment,
} = require('../controllers/comments.controllers');

articlesRouter.route('/').get(getArticles);
articlesRouter.route('/:article_id').get(getArticleById).patch(patchArticle);
articlesRouter
  .route('/:article_id/comments')
  .get(getCommentsByArticleId)
  .post(postComment);

module.exports = articlesRouter;
