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
});
