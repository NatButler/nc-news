const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('NC-news API', () => {
  describe('GET: /api', () => {
    test('200: returns a json object detailing each endpoint available on the api', () => {
      return request(app)
        .get('/api')
        .expect(200)
        .then(({ body: { endpoints } }) => {
          expect(typeof endpoints).toBe('object');
          expect(endpoints).toHaveProperty('GET /api');
          expect(endpoints).toHaveProperty('GET /api/topics');
          expect(endpoints).toHaveProperty('GET /api/articles');
        });
    });
  });

  describe('GET: /api/topics', () => {
    test('200: returns all topics in an array of objects', () => {
      return request(app)
        .get('/api/topics')
        .expect(200)
        .then((response) => {
          const {
            body: { topics },
          } = response;
          expect(topics).toHaveLength(3);
          topics.forEach((topic) => {
            expect(topic).toEqual(
              expect.objectContaining({
                slug: expect.any(String),
                description: expect.any(String),
              })
            );
          });
        });
    });
  });

  describe('GET: /api/articles/:article_id', () => {
    test('200: returns a single article object, found by id', () => {
      return request(app)
        .get('/api/articles/1')
        .expect(200)
        .then((response) => {
          const {
            body: { article },
          } = response;
          expect(article).toEqual(
            expect.objectContaining({
              article_id: expect.any(Number),
              author: expect.any(String),
              title: expect.any(String),
              body: expect.any(String),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_img_url: expect.any(String),
            })
          );
        });
    });
    test('404: sends an appropriate status and error message when given a valid but non-existent id', () => {
      return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Article does not exist');
        });
    });
    test('400: responds with an appropriate error message when given an invalid id', () => {
      return request(app)
        .get('/api/articles/not-an-id')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
  });

  describe('GET: /api/articles', () => {
    test('200: returns all articles in an array of objects, sorted by date in descending order', () => {
      return request(app)
        .get('/api/articles')
        .expect(200)
        .then((response) => {
          const {
            body: { articles },
          } = response;
          articles.forEach((article) => {
            expect(article).not.toHaveProperty('body');
            expect(article).toEqual(
              expect.objectContaining({
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                topic: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                article_img_url: expect.any(String),
                comment_count: expect.any(String),
              })
            );
          });
          expect(articles).toBeSorted({
            key: 'created_at',
            descending: true,
          });
        });
    });
  });

  describe('GET: /api/articles/article_id/comments', () => {
    test('200: returns all comments for a specific article as an array of objects', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
          const {
            body: { comments },
          } = response;
          expect(comments).toHaveLength(11);
          comments.forEach((comment) => {
            expect(comment).toEqual(
              expect.objectContaining({
                comment_id: expect.any(Number),
                votes: expect.any(Number),
                created_at: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                article_id: expect.any(Number),
              })
            );
          });
        });
    });
    test('200: returns an array of comments ordered by created_at in descending order', () => {
      return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then((response) => {
          const {
            body: { comments },
          } = response;
          expect(comments).toBeSorted({
            key: 'created_at',
            descending: true,
          });
        });
    });
    test('404: sends an appropriate status and error message when given a valid but non-existent id', () => {
      return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe('Not found');
        });
    });
    test('400: responds with an appropriate error message when given an invalid id', () => {
      return request(app)
        .get('/api/articles/not-an-id/comments')
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe('Bad request');
        });
    });
  });

  describe('POST: /api/articles/:article_id/comments', () => {
    test('201: adds a comment to a given article and returns newly created comment object', () => {
      const requestBody = {
        username: 'butter_bridge',
        body: 'Some comment text',
      };
      return request(app)
        .post('/api/articles/1/comments')
        .send(requestBody)
        .expect(201)
        .then((response) => {
          const {
            body: { comment },
          } = response;
          console.log(comment);
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: 0,
              created_at: expect.any(String),
              author: 'butter_bridge',
              body: 'Some comment text',
              article_id: 1,
            })
          );
        });
    });
    test('400: responds with an appropriate status and error message when provided with a bad request body (no comment body)', () => {
      return request(app)
        .post('/api/articles/1/comments')
        .send({
          username: 'butter_bridge',
        })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe('Bad request');
        });
    });
    test('400: repsonds with an appropriate status and error message when attempting to create a comment with a user that does not exist', () => {
      return request(app)
        .post('/api/articles/1/comments')
        .send({
          username: 'userThatDoesNotExist',
          body: 'Some comment text',
        })
        .expect(400)
        .then((response) => {
          const { body } = response;
          expect(body.msg).toBe('Bad request');
        });
    });
  });
});
