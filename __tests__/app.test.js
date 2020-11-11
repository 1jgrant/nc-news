process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');

describe('/api', () => {
  afterAll(() => db.destroy());
  beforeEach(() => db.seed.run());
  describe('/topics', () => {
    describe('GET', () => {
      test('GET - 200 - should respond with an array of the correct length', () => {
        return request(app)
          .get('/api/topics')
          .expect(200)
          .then((res) => {
            expect(res.body.topics.length).toBe(3);
          });
      });
      test('GET - 200 - responds with an array of correctly formatted objects', () => {
        return request(app)
          .get('/api/topics')
          .then((res) => {
            expect(Object.keys(res.body.topics[0])).toEqual(
              expect.arrayContaining(['slug', 'description']),
            );
          });
      });
    });
    describe('INVALID METHODS', () => {
      test('405 - patch, delete, put', () => {
        const invalidMethods = ['patch', 'put', 'delete'];
        const requestPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/topics')
            .expect(405)
            .then((res) => {
              expect(res.body.msg).toBe('Invalid Method');
            });
        });
        return Promise.all(requestPromises);
      });
    });
  });
  describe('/users', () => {});
  describe('/users/:username', () => {
    describe('GET', () => {
      test('GET - 200 - should respond with a user object containing a single user', () => {
        return request(app)
          .get('/api/users/lurker')
          .expect(200)
          .then((res) => {
            expect(res.body).toMatchObject({
              user: expect.any(Object),
            });
          });
      });
      test('GET - 200 - user object should have the required keys', () => {
        return request(app)
          .get('/api/users/lurker')
          .expect(200)
          .then((res) => {
            expect(res.body).toMatchObject({
              user: {
                username: expect.any(String),
                avatar_url: expect.any(String),
                name: expect.any(String),
              },
            });
          });
      });
      test('GET - 404 - for a username that does not exist ', () => {
        return request(app)
          .get('/api/users/notAUser')
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe('Username not found');
          });
      });
    });
    describe('INVALID METHODS', () => {
      test('405 - post, patch, delete, put', () => {
        const invalidMethods = ['post', 'patch', 'put', 'delete'];
        const requestPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/users/lurker')
            .expect(405)
            .then((res) => {
              expect(res.body.msg).toBe('Invalid Method');
            });
        });
        return Promise.all(requestPromises);
      });
    });
  });
  describe('/articles', () => {});
  describe('/articles/:article_id', () => {
    describe('GET', () => {
      test('GET - 200 - should respond with an article object containing info for a single article', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then((res) => {
            expect(res.body).toMatchObject({ article: expect.any(Object) });
          });
      });
      test('GET - 200 - article object should have the required keys', () => {
        return request(app)
          .get('/api/articles/1')
          .expect(200)
          .then((res) => {
            expect(res.body).toMatchObject({
              article: {
                author: expect.any(String),
                title: expect.any(String),
                article_id: expect.any(Number),
                body: expect.any(String),
                topic: expect.any(String),
                votes: expect.any(Number),
                created_at: '2018-11-15T12:21:54.171Z',
                comment_count: expect.any(Number),
              },
            });
          });
      });
      test('GET - 200 - comment count should be equal to the number of comments related to the object', () => {
        return request(app)
          .get('/api/articles/5')
          .expect(200)
          .then((res) => {
            expect(res.body.article.comment_count).toBe(2);
          });
      });
      test('GET - 404 - for an article_id that does not exist', () => {
        return request(app)
          .get('/api/articles/500')
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe('Article not found');
          });
      });
      test('GET - 400 - for a non numeric article id', () => {
        return request(app)
          .get('/api/articles/five')
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe('Bad Request');
          });
      });
    });
    describe('PATCH', () => {
      test('PATCH - 200 - should increase the number of votes by the requested number and respond with the updated article body', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 2 })
          .expect(200)
          .then((res) => {
            expect(res.body.updatedArticle.votes).toBe(102);
          });
      });
      test('PATCH - 200 - should decrease the number of votes by the requested number and respond with the updated article body', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: -2 })
          .expect(200)
          .then((res) => {
            expect(res.body.updatedArticle.votes).toBe(98);
          });
      });
      test('PATCH - 200 - default behaviour should be to increment vote count by 1 when req body is invalid', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 'five' })
          .expect(200)
          .then((res) => {
            expect(res.body.updatedArticle.votes).toBe(101);
          });
      });
      test('PATCH - 200 - default behaviour should be to ignore other properties on the request body', () => {
        return request(app)
          .patch('/api/articles/1')
          .send({ inc_votes: 5, name: 'Mitch' })
          .expect(200)
          .then((res) => {
            expect(res.body.updatedArticle.votes).toBe(105);
          });
      });
      test('PATCH - 404 - for an article_id that does not exist', () => {
        return request(app)
          .patch('/api/articles/500')
          .send({ inc_votes: -2 })
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe('Article not found');
          });
      });
      test('GET - 400 - for a non numeric article id', () => {
        return request(app)
          .get('/api/articles/five')
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe('Bad Request');
          });
      });
    });
    describe('INVALID METHODS', () => {
      test('405 - post, put', () => {
        const invalidMethods = ['post', 'put'];
        const requestPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/articles/1')
            .expect(405)
            .then((res) => {
              expect(res.body.msg).toBe('Invalid Method');
            });
        });
        return Promise.all(requestPromises);
      });
    });
  });
  describe('/articles/:article_id/comments', () => {
    describe('GET', () => {});
    describe('POST', () => {
      test('POST - 201 - should create a new, correctly formatted comment', () => {
        return request(app)
          .post('/api/articles/3/comments')
          .send({ username: 'butter_bridge', body: 'Test comment body' })
          .expect(201)
          .then((res) => {
            expect(res.body).toMatchObject({
              newComment: {
                comment_id: expect.any(Number),
                author: 'butter_bridge',
                article_id: expect.any(Number),
                votes: 0,
                created_at: expect.any(String),
                body: 'Test comment body',
              },
            });
          });
      });
      test('POST - 201 - new comment should have an incremented comment_id and the specified article id', () => {
        return request(app)
          .post('/api/articles/3/comments')
          .send({ username: 'butter_bridge', body: 'Test comment body' })
          .expect(201)
          .then((res) => {
            expect(res.body).toMatchObject({
              newComment: {
                comment_id: 19,
                author: 'butter_bridge',
                article_id: 3,
              },
            });
          });
      });
      test('POST - 201 - should ignore additional properties in the request body', () => {
        return request(app)
          .post('/api/articles/3/comments')
          .send({
            username: 'butter_bridge',
            body: 'Test comment body',
            extraProp: 'unwanted data',
          })
          .expect(201)
          .then((res) => {
            expect(res.body).toMatchObject({
              newComment: {
                comment_id: 19,
                author: 'butter_bridge',
                article_id: 3,
                votes: 0,
                body: 'Test comment body',
              },
            });
          });
      });
      test('POST - 400 - for an article_id that does not exist', () => {
        return request(app)
          .post('/api/articles/500/comments')
          .send({ username: 'butter_bridge', body: 'Test comment body' })
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe('Bad Request: Article does not exist');
          });
      });
    });
    describe('INVALID METHODS', () => {});
  });
  describe('/missingRoute', () => {
    test('All Methods - 404', () => {
      const allMethods = ['get', 'post', 'put', 'patch', 'delete'];
      const methodPromises = allMethods.map((method) => {
        return request(app)
          [method]('/missingRoute')
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe('Route not found');
          });
      });
    });
  });
});
