process.env.NODE_ENV = "test";
const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");

describe("/api", () => {
  afterAll(() => db.destroy());
  beforeEach(() => db.seed.run());
  describe("/topics", () => {
    describe("GET", () => {
      test("GET - 200 - should respond with an array of the correct length", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then((res) => {
            expect(res.body.topics.length).toBe(3);
          });
      });
      test("GET - 200 - responds with an array of correctly formatted objects", () => {
        return request(app)
          .get("/api/topics")
          .then((res) => {
            expect(Object.keys(res.body.topics[0])).toEqual(
              expect.arrayContaining(["slug", "description"])
            );
          });
      });
    });
    describe("INVALID METHODS", () => {
      test("405 - patch, delete, put", () => {
        const invalidMethods = ["patch", "put", "delete"];
        const requestPromises = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/topics")
            .expect(405)
            .then((res) => {
              expect(res.body.msg).toBe("Invalid Method");
            });
        });
        return Promise.all(requestPromises);
      });
    });
  });
  describe("/users", () => {});
  describe("/users/:username", () => {
    describe("GET", () => {
      test("GET - 200 - should respond with a user object containing a single user", () => {
        return request(app)
          .get("/api/users/lurker")
          .expect(200)
          .then((res) => {
            expect(res.body).toMatchObject({
              user: expect.any(Object),
            });
          });
      });
      test("GET - 200 - user object should have the required keys", () => {
        return request(app)
          .get("/api/users/lurker")
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
    });
  });
  describe("/missingRoute", () => {
    test("All Methods - 404", () => {
      const allMethods = ["get", "post", "put", "patch", "delete"];
      const methodPromises = allMethods.map((method) => {
        return request(app)
          [method]("/missingRoute")
          .expect(404)
          .then((res) => {
            expect(res.body.msg).toBe("Route not found");
          });
      });
    });
  });
});
