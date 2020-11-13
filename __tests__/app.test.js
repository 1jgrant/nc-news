process.env.NODE_ENV = 'test';
const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');

describe('/api', () => {
  afterAll(() => db.destroy());
  beforeEach(() => db.seed.run());
  describe('/', () => {
    describe('GET', () => {
      test('GET - 200 - should respond with JSON of available endpoints', () => {
        return request(app)
          .get('/api')
          .expect(200)
          .then((res) => {
            // check if response is JSON by parsing and checking keys
            const parsed = JSON.parse(res.body);
            const keys = Object.keys(parsed);
            expect(keys.length).toBe(12);
          });
      });
    });
    describe('INVALID METHODS', () => {
      test('405 - post, put, patch, delete', () => {
        const invalidMethods = ['post', 'put', 'patch', 'delete'];
        const requestPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api')
            .expect(405)
            .then((res) => {
              expect(res.body.msg).toBe('Invalid Method');
            });
        });
        return Promise.all(requestPromises);
      });
    });
  });
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
    describe('POST', () => {
      test('POST - 201 - should create a new topic', () => {
        return request(app)
          .post('/api/topics')
          .send({ slug: 'testSlug', description: 'testTopic description' })
          .expect(201)
          .then(() => {
            return request(app).get('/api/topics');
          })
          .then((res) => {
            expect(res.body.topics.length).toBe(4);
          });
      });
      test('POST - 201 - should respond with the new topic', () => {
        return request(app)
          .post('/api/topics')
          .send({ slug: 'testSlug', description: 'testTopic description' })
          .expect(201)
          .then((res) => {
            expect(res.body.newTopic).toMatchObject({
              slug: 'testSlug',
              description: 'testTopic description',
            });
          });
      });
      test('POST - 400 - for a topic that is missing the required keys', () => {
        return request(app)
          .post('/api/topics')
          .send({ description: 'testTopic description' })
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe('Bad request: missing required keys');
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
  describe('/users', () => {
    describe('GET', () => {
      test('GET - 200 - should respond with an array of all users', () => {
        return request(app)
          .get('/api/users')
          .expect(200)
          .then((res) => {
            expect(res.body.users.length).toBe(4);
          });
      });
      test('GET - 200 - responds with an array of correctly formatted objects', () => {
        return request(app)
          .get('/api/users')
          .expect(200)
          .then((res) => {
            expect(Object.keys(res.body.users[1])).toEqual(
              expect.arrayContaining(['username', 'avatar_url', 'name']),
            );
          });
      });
    });
    describe('POST', () => {
      test('POST - 201 - should create a new user', () => {
        return request(app)
          .post('/api/users')
          .send({
            username: 'testUsername',
            avatar_url: 'testUrl',
            name: 'testName',
          })
          .expect(201)
          .then((res) => {
            return request(app).get('/api/users');
          })
          .then((res) => {
            expect(res.body.users.length).toBe(5);
          });
      });
      test('POST - 201 - should return the new user in the correct format', () => {
        return request(app)
          .post('/api/users')
          .send({
            username: 'testUsername',
            avatar_url: 'testUrl',
            name: 'testName',
          })
          .expect(201)
          .then((res) => {
            expect(res.body.newUser).toMatchObject({
              username: 'testUsername',
              avatar_url: 'testUrl',
              name: 'testName',
            });
          });
      });
      test('POST - 400 - for a post that is missing required keys', () => {
        return request(app)
          .post('/api/users')
          .send({
            avatar_url: 'testUrl',
            name: 'testName',
          })
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe('Bad request: missing required keys');
          });
      });
    });
    describe('INVALID METHODS', () => {
      test('405 - put, patch, delete', () => {
        const invalidMethods = ['put', 'patch', 'delete'];
        const requestPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/users')
            .expect(405)
            .then((res) => {
              expect(res.body.msg).toBe('Invalid Method');
            });
        });
        return Promise.all(requestPromises);
      });
    });
  });
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
  describe('/articles', () => {
    describe('GET', () => {
      test('GET - 200 - should respond with an array of all article objects, limited to 10 by default', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toBe(10);
          });
      });
      test('GET - 200 - objects should have the required keys', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then((res) => {
            expect(res.body.articles[0]).toMatchObject({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            });
          });
      });
      test('GET - 200 - comment_count should be equal to the number of comments linked to an article', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then((res) => {
            expect(res.body.articles[8].comment_count).toBe(2);
          });
      });
      test('GET - 200 - articles should be sorted by descending date order by default', () => {
        return request(app)
          .get('/api/articles')
          .expect(200)
          .then((res) => {
            expect(res.body.articles).toBeSortedBy('created_at', {
              descending: true,
            });
          });
      });
      test('GET - 200 - articles may be sorted by any valid column via query', () => {
        return request(app)
          .get('/api/articles?sort_by=votes')
          .expect(200)
          .then((res) => {
            expect(res.body.articles).toBeSortedBy('votes', {
              descending: true,
            });
          });
      });
      test('GET - 200 - articles may be ordered ascending via query', () => {
        return request(app)
          .get('/api/articles?sort_by=comment_count&order=asc')
          .expect(200)
          .then((res) => {
            expect(res.body.articles).toBeSortedBy('comment_count', {
              descending: false,
            });
          });
      });
      test('GET - 200 - articles may be filtered by author via query', () => {
        return request(app)
          .get('/api/articles?author=rogersop')
          .expect(200)
          .then((res) => {
            const hasCorrectAuthor = res.body.articles.every(
              (article) => article.author === 'rogersop',
            );
            expect(hasCorrectAuthor).toBe(true);
          });
      });
      test('GET - 200 - articles may be filtered by topic via query', () => {
        return request(app)
          .get('/api/articles?topic=cats')
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toBe(1);
            expect(res.body.articles[0].topic).toBe('cats');
          });
      });
      test('GET - 200 - articles limit should be adjustable via query', () => {
        return request(app)
          .get('/api/articles?limit=15')
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toBe(12);
          });
      });
      test('GET - 200 - articles can be viewed in pages by using p query', () => {
        return request(app)
          .get('/api/articles?p=2')
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toBe(2);
          });
      });
      test('GET - 200 - when p and limit are used together, the results are as expected', () => {
        return request(app)
          .get('/api/articles?limit=3&p=2')
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toBe(3);
            expect(res.body.articles).toBeSortedBy('created_at', {
              descending: true,
            });
          });
      });
      test('GET - 200 - negative page numbers default to 1', () => {
        return request(app)
          .get('/api/articles?p=-2')
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toBe(10);
            expect(res.body.articles[0].article_id).toBe(1);
          });
      });
      test('GET - 200 - endpoint ignores non numeric limit and p', () => {
        return request(app)
          .get('/api/articles?limit=five&p=two')
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toBe(10);
            expect(res.body.articles[0].article_id).toBe(1);
          });
      });
      test('GET - 200 - endpoint should ignore invalid sort_by column', () => {
        return request(app)
          .get('/api/articles?sort_by=invalidColumn')
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toBe(10);
          });
      });
      test('GET - 200 - endpoint should ignore invalid order by', () => {
        return request(app)
          .get('/api/articles?sort_by=votes&order=down')
          .expect(200)
          .then((res) => {
            expect(res.body.articles).toBeSortedBy('votes', {
              descending: true,
            });
          });
      });
      test('GET - 200 - endpoint should ignore invalid queries', () => {
        return request(app)
          .get('/api/articles?writer=rogersop')
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).toBe(10);
          });
      });
      test('GET - 200 - should respond with empty array when queried author is a user but has no articles', () => {
        return request(app)
          .get('/api/articles?author=lurker')
          .expect(200)
          .then((res) => {
            expect(res.body.articles).toEqual([]);
          });
      });
      test('GET - 404 - should respond with a 404 when queried author is not found', () => {
        return request(app)
          .get('/api/articles?author=notAUser')
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe('Author not found');
          });
      });
    });
    describe('POST', () => {
      test('POST - 201 - should create a new, correctly formatted article', () => {
        return request(app)
          .post('/api/articles')
          .send({
            title: 'Test article',
            topic: 'cats',
            author: 'butter_bridge',
            body: 'testing testing',
          })
          .expect(201)
          .then((res) => {
            expect(res.body.newArticle).toMatchObject({
              article_id: 13,
              title: 'Test article',
              votes: 0,
              topic: 'cats',
              author: 'butter_bridge',
              body: 'testing testing',
              created_at: expect.any(String),
            });
          });
      });
      test('POST - 201 - should ignore additional properties on request body', () => {
        return request(app)
          .post('/api/articles')
          .send({
            title: 'Test article',
            topic: 'cats',
            author: 'butter_bridge',
            body: 'testing testing',
            notAColumn: 'invalid',
          })
          .expect(201)
          .then((res) => {
            expect(res.body.newArticle).toMatchObject({
              article_id: 13,
              title: 'Test article',
              votes: 0,
              topic: 'cats',
              author: 'butter_bridge',
              body: 'testing testing',
              created_at: expect.any(String),
            });
          });
      });
      test('POST - 400 - for a post that is missing required keys', () => {
        return request(app)
          .post('/api/articles')
          .send({
            title: 'test article',
          })
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe('Bad request: missing required keys');
          });
      });
      test('POST - 422 - when trying to post to a non existent topic', () => {
        return request(app)
          .post('/api/articles')
          .send({
            title: 'Test title',
            topic: 'not a topic',
            author: 'butter_bridge',
            body: 'testing testing',
          })
          .expect(422)
          .then((res) => {
            expect(res.body.msg).toBe('Unprocessable Entity');
          });
      });
      test('POST - 422 - when trying to post to a non existent author', () => {
        return request(app)
          .post('/api/articles')
          .send({
            title: 'Test title',
            topic: 'cats',
            author: 'James',
            body: 'testing testing',
          })
          .expect(422)
          .then((res) => {
            expect(res.body.msg).toBe('Unprocessable Entity');
          });
      });
    });
    describe('INVALID METHODS', () => {
      test('405 - put, patch, delete', () => {
        const invalidMethods = ['put', 'patch', 'delete'];
        const requestPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/articles')
            .expect(405)
            .then((res) => {
              expect(res.body.msg).toBe('Invalid Method');
            });
        });
        return Promise.all(requestPromises);
      });
    });
  });
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
      test('PATCH - 400 - for a non numeric article id', () => {
        return request(app)
          .patch('/api/articles/five')
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe('Bad Request');
          });
      });
    });
    describe('DELETE', () => {
      test('DELETE - 204 - should delete the requested article', () => {
        return request(app)
          .delete('/api/articles/5')
          .expect(204)
          .then(() => {
            return request(app).get('/api/articles?limit=15');
          })
          .then((res) => {
            expect(res.body.articles.length).toBe(11);
          });
      });
      test('DELETE - 204 - comments that reference the deleted article should also be deleted', () => {
        return request(app)
          .delete('/api/articles/5')
          .expect(204)
          .then(() => {
            return db('comments');
          })
          .then((comments) => {
            const hasDeletedId = comments.some(
              (comment) => comment.article_id === 5,
            );
            expect(hasDeletedId).toBe(false);
            expect(comments.length).toBe(16);
          });
      });
      test('DELETE - 404 - for an article_id that does not exist', () => {
        return request(app)
          .delete('/api/articles/500')
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe('Article not found');
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
    describe('GET', () => {
      test('GET - 200 - should respond with an array of comments for the given article_id, default limit 10', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then((res) => {
            expect(res.body.comments.length).toBe(10);
          });
      });
      test('GET - 200 - comments in the array should have the correct format', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .then((res) => {
            expect(Object.keys(res.body.comments[0])).toEqual(
              expect.arrayContaining([
                'comment_id',
                'author',
                'votes',
                'created_at',
                'body',
              ]),
            );
          });
      });
      test('GET - 200 - responds with an array that is sorted by newest first by default', () => {
        return request(app)
          .get('/api/articles/1/comments')
          .expect(200)
          .then((res) => {
            expect(res.body.comments).toBeSortedBy('created_at', {
              descending: true,
            });
          });
      });
      test('GET - 200 - comments can be sorted by any other valid column via query, descending by default', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=votes')
          .expect(200)
          .then((res) => {
            expect(res.body.comments).toBeSortedBy('votes', {
              descending: true,
            });
          });
      });
      test('GET - 200 - comments can be ordered in ascending order via query', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=votes&order=asc')
          .expect(200)
          .then((res) => {
            expect(res.body.comments).toBeSortedBy('votes', {
              descending: false,
            });
          });
      });
      test('GET - 200 - comments limit should be adjustable via query', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=5')
          .expect(200)
          .then((res) => {
            expect(res.body.comments.length).toBe(5);
          });
      });
      test('GET - 200 - comments may be viewed in pages via query', () => {
        return request(app)
          .get('/api/articles/1/comments?p=2')
          .expect(200)
          .then((res) => {
            expect(res.body.comments.length).toBe(3);
          });
      });
      test('GET - 200 - negative page numbers default to 1', () => {
        return request(app)
          .get('/api/articles/1/comments?p=-2')
          .expect(200)
          .then((res) => {
            expect(res.body.comments[0].comment_id).toBe(2);
          });
      });
      test('GET - 200 - endpoint ignores non numeric limit and p', () => {
        return request(app)
          .get('/api/articles/1/comments?limit=five&p=two')
          .expect(200)
          .then((res) => {
            expect(res.body.comments[0].comment_id).toBe(2);
          });
      });
      test('GET - 200 - endpoint should ignore invalid queries', () => {
        return request(app)
          .get('/api/articles/1/comments?sort_by=invalidColumn')
          .expect(200)
          .then((res) => {
            expect(res.body.comments.length).toBe(10);
          });
      });
      test('GET - 404 - should respond with a 404 when article does not exist', () => {
        return request(app)
          .get('/api/articles/500/comment')
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe('Route not found');
          });
      });
    });
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
      test("POST - 201 - adding a comment to an article should increment that article's comment count", () => {
        return request(app)
          .post('/api/articles/3/comments')
          .send({ username: 'butter_bridge', body: 'Test comment body' })
          .then((res) => {
            return request(app)
              .get('/api/articles/3')
              .then((res) => {
                expect(res.body.article.comment_count).toBe(1);
              });
          });
      });
      test('POST - 422 - for an article_id that does not exist', () => {
        return request(app)
          .post('/api/articles/500/comments')
          .send({ username: 'butter_bridge', body: 'Test comment body' })
          .expect(422)
          .then((res) => {
            expect(res.body.msg).toBe('Unprocessable Entity');
          });
      });
      test('POST - 400 - for a comment without a username', () => {
        return request(app)
          .post('/api/articles/2/comments')
          .send({ body: 'Test comment body' })
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe('Bad Request: Incorrect comment format');
          });
      });
      test('POST - 422 - for correctly formatted comment with a non existent username', () => {
        return request(app)
          .post('/api/articles/2/comments')
          .send({ username: 'notAUser', body: 'Test comment body' })
          .expect(422)
          .then((res) => {
            expect(res.body.msg).toBe('Unprocessable Entity');
          });
      });
    });
    describe('INVALID METHODS', () => {
      test('405 - put, patch, delete', () => {
        const invalidMethods = ['put', 'patch', 'delete'];
        const requestPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/articles/1/comments')
            .expect(405)
            .then((res) => {
              expect(res.body.msg).toBe('Invalid Method');
            });
        });
        return Promise.all(requestPromises);
      });
    });
  });
  describe('/comments/:comment_id', () => {
    describe('PATCH', () => {
      test('PATCH - 200 - should update the vote count on the comment and respond with the updated comment', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 2 })
          .expect(200)
          .then((res) => {
            expect(res.body.updatedComment.votes).toBe(18);
          });
      });
      test('PATCH - 200 - should decrease the number of votes by the requested number and respond with the updated comment', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: -3 })
          .expect(200)
          .then((res) => {
            expect(res.body.updatedComment.votes).toBe(13);
          });
      });
      test('PATCH - 200 - default behaviour should be to increment vote count by 1 when req body is invalid', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({})
          .expect(200)
          .then((res) => {
            expect(res.body.updatedComment.votes).toBe(17);
          });
      });
      test('PATCH - 200 - default behaviour should be to ignore other properties on the request body', () => {
        return request(app)
          .patch('/api/comments/1')
          .send({ inc_votes: 5, name: 'Mitch' })
          .expect(200)
          .then((res) => {
            expect(res.body.updatedComment.votes).toBe(21);
          });
      });
      test('PATCH - 404 - for a comment_id that does not exist', () => {
        return request(app)
          .patch('/api/comments/500')
          .send({ inc_votes: -2 })
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe('Comment not found');
          });
      });
      test('PATCH - 400 - for a non numeric comment id', () => {
        return request(app)
          .patch('/api/comments/five')
          .expect(400)
          .then((res) => {
            expect(res.body.msg).toBe('Bad Request');
          });
      });
    });
    describe('DELETE', () => {
      test('DELETE - 204 - should delete the requested comment', () => {
        return request(app)
          .delete('/api/comments/14')
          .expect(204)
          .then(() => {
            return request(app).get('/api/articles/5');
          })
          .then((res) => {
            expect(res.body.article.comment_count).toBe(1);
          });
      });
      test('DELETE - 404 - for a comment id that does not exist', () => {
        return request(app)
          .delete('/api/comments/500')
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe('Comment not found');
          });
      });
    });
    describe('INVALID METHODS', () => {
      test('405 - get, post, put', () => {
        const invalidMethods = ['get', 'post', 'put'];
        const requestPromises = invalidMethods.map((method) => {
          return request(app)
            [method]('/api/comments/1')
            .expect(405)
            .then((res) => {
              expect(res.body.msg).toBe('Invalid Method');
            });
        });
        return Promise.all(requestPromises);
      });
    });
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
      return Promise.all(methodPromises);
    });
  });
});
