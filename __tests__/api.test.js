const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');
const data = require('../db/data/test-data/index');

beforeEach(() => seed(data));
afterAll(() => db.end());

describe('NC-news API', () => {
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
});
