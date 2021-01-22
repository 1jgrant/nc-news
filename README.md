# Northcoders News API

REST API to serve data to the front end NC news, reddit style news site</br>

### API hosted at https://jg-news-app.herokuapp.com/api

### Front end hosted at ...

## Table of Contents

- [About](#about)
- [Technologies](#technologies)
- [Endpoints](#endpoints)
- [How to Use](#how-to-use)
  - [Code](#code)
  - [Running Tests](#running-tests)
  - [Accessing Endpoints](#accessing-endpoints)

## About

This is a REST API I built as the back end to a reddit style news website. The API has endpoints that allow a range of get, post, patch and delete methods on topics, articles, comments and users.</br>
[Express](https://expressjs.com/) framework was used for routing and middleware in an MVC design pattern and [Knex](http://knexjs.org/) was used to migrate and seed the database with test and production data.</br>
I followed test-driven development throughout development of all endpoints, writing tests with [Jest](https://jestjs.io/) framework and [Supertest](https://www.npmjs.com/package/supertest) for testing HTTP.</br>
The API is hosted on Heroku, where you may view information on all endpoints https://jg-news-app.herokuapp.com/api </br>
The front end news site is hosted at ...

## Technologies

- [Express](https://expressjs.com/)
- [Knex](http://knexjs.org/)
- [PostgreSQL](https://www.npmjs.com/package/pg)
- [Nodemon](https://www.npmjs.com/package/nodemon)
- [Jest](https://jestjs.io/) & [Supertest](https://www.npmjs.com/package/supertest) for TDD

## Endpoints

Go to https://jg-news-app.herokuapp.com/api for full details on the available API endpoints, including their queries and responses

```http
GET /api
GET /api/topics
GET /api/users
GET /api/users/:username
GET /api/articles/article_id
GET /api/articles/article_id/comments
GET /api/articles

POST /api/topics
POST /api/users
POST /api/articles/article_id/comments
POST /api/articles

PATCH /api/articles/article_id
PATCH /api/comments/:comment_id

DELETE /api/articles/:article_id
DELETE /api/comments/:comment_id
```

## How to Use

### Code

- Fork and clone the repo

To install with all dependencies:

```
$ cd ../be-nc-news
$ npm i
```

Create & seed the database:

```
$ npm run setup-dbs
Seed the db with either test or production data:
$ npm run seed
or
$ npm run seed:prod
```

### Running Tests

To run the test suite:

```
$ npm run test-app
```

### Accessing Endpoints

Start the server with:

```
$ npm start
```

You may then access the endpoints at http://localhost:9090. Using a desktop API client such as [Insomnia](https://insomnia.rest/products/core/) or [Postman](https://www.postman.com/product/api-client/) will allow you to send POST, PATCH and DELETE requests
