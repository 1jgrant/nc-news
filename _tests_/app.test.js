process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest');
const connection = require('../db/connection');

describe('/api', () => {
  afterAll(() => connection.destroy());
  beforeEach(() => connection.seed.run());
  describe('/topics', () => {
    describe('GET', () => {
      test('responds with 200 and array of correct length', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then((res) => {
            expect(res.body.topics.length).toBe(3);
          });
      });
      test('responds with correctly formatted array', () => {
        return request(app)
          .get('/api/topics')
          .then((res) => {
            expect(Object.keys(res.body.topics[0])).toEqual(
              expect.arrayContaining(['slug', 'description'])
            );
          });
      });
    });
  });
});
