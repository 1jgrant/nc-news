const db = require('../db/connection');

const fetchArticleById = (articleId) => {
  return db
    .select('articles.*')
    .from('articles')
    .where('articles.article_id', articleId.article_id)
    .count({ comment_count: 'comment_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .then((res) => {
      if (res.length === 0) {
        return Promise.reject({ status: 404, msg: 'Article not found' });
      }
      // knex count returns string, convert count to a number
      res[0].comment_count = Number(res[0].comment_count);
      return res[0];
    });
};

const updateArticleById = (articleId, votes) => {
  const inc = Number(votes.inc_votes)
    ? { votes: votes.inc_votes }
    : { votes: 1 };
  return db
    .select('*')
    .from('articles')
    .where('articles.article_id', articleId.article_id)
    .increment(inc)
    .returning('*')
    .then((res) => {
      if (res.length === 0) {
        return Promise.reject({ status: 404, msg: 'Article not found' });
      }
      return res[0];
    });
};

const createComment = (articleId, { username, body }) => {
  const comment = { author: username, body: body, ...articleId };
  return db('comments')
    .insert(comment)
    .returning('*')
    .then((res) => {
      return res[0];
    });
};

const fetchCommentsByArticleId = (articleId, { sort_by, order, limit, p }) => {
  const validColumns = ['comment_id', 'votes', 'created_at', 'author', 'body'];
  const sortColumn = validColumns.includes(sort_by) ? sort_by : 'created_at';
  const orderDir = order === 'asc' ? 'asc' : 'desc';
  // create limit and offset for pagination
  const pageLimit = Number(limit) ? limit : 10;
  const page = p > 1 ? p : 1;
  const offset = (page - 1) * pageLimit;
  return db
    .select('comment_id', 'votes', 'created_at', 'author', 'body')
    .from('comments')
    .where(articleId)
    .orderBy(sortColumn, orderDir)
    .offset(offset)
    .limit(pageLimit);
};

const fetchArticles = ({ sort_by, order, author, topic, limit, p }) => {
  // logic to check if sort_by query is on a valid column
  // using array first, should update to fetch all valid columns via request
  const validColumns = [
    'author',
    'title',
    'article_id',
    'topic',
    'created_at',
    'votes',
    'comment_count',
  ];
  const sortColumn = validColumns.includes(sort_by) ? sort_by : 'created_at';
  const orderDir = order === 'asc' ? 'asc' : 'desc';
  // create limit and offset for pagination
  const pageLimit = Number(limit) ? limit : 10;
  const page = p > 1 ? p : 1;
  const offset = (page - 1) * pageLimit;
  // query the db
  return db
    .select('articles.*')
    .from('articles')
    .count({ comment_count: 'comment_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .orderBy(sortColumn, orderDir)
    .offset(offset)
    .limit(pageLimit)
    .modify((query) => {
      if (author)
        query.where(db.raw('UPPER(articles.author) LIKE UPPER(?)', author));
      if (topic) query.where(db.raw('UPPER(topic) LIKE UPPER(?)', topic));
    })
    .then((articles) => {
      // when there are no articles in the response, we need to check if the
      // author exists or not and handle appropriately
      if (articles.length === 0 && author) {
        return Promise.all([articles, checkAuthorExists(author), true]);
      } else if (articles.length === 0 && topic) {
        return Promise.all([articles, true, checkTopicExists(topic)]);
      } else return [articles, true, true];
    })
    .then(([articles, authorExists, topicExists]) => {
      if (!authorExists) {
        return Promise.reject({ status: 404, msg: 'Author not found' });
      }
      if (!topicExists) {
        return Promise.reject({ status: 404, msg: 'Topic not found' });
      }
      // knex count returns string, convert counts to numbers
      articles.forEach((article) => {
        article.comment_count = Number(article.comment_count);
      });
      return articles;
    });
};

const checkAuthorExists = (author) => {
  return db
    .select('*')
    .from('users')
    .where({ username: author })
    .then((author) => {
      return author.length === 0 ? false : true;
    });
};

const checkTopicExists = (topic) => {
  return db
    .select('*')
    .from('topics')
    .where({ slug: topic })
    .then((topic) => {
      return topic.length === 0 ? false : true;
    });
};

const createArticle = ({ title, topic, author, body }) => {
  // handle error of request body missing required keys
  // before inserting into db
  if (!title || !topic || !author || !body) {
    return Promise.reject({
      status: 400,
      msg: 'Bad request: missing required keys',
    });
  }
  const newArticle = { title, topic, author, body };
  return db('articles')
    .insert(newArticle)
    .returning('*')
    .then((res) => {
      return res[0];
    });
};

const removeArticle = (articleId) => {
  return db('articles')
    .del()
    .where(articleId)
    .then((delCount) => {
      if (delCount === 0) {
        return Promise.reject({ status: 404, msg: 'Article not found' });
      }
    });
};

// function to have a scalable check of valid columns
// const checkColumnExists = (column, table) => {
//   return db
//     .select('*')
//     .from(table)
//     .then((res) => {
//       console.log('columns>>>', res);
//     });
// };

module.exports = {
  fetchArticleById,
  updateArticleById,
  createComment,
  fetchCommentsByArticleId,
  fetchArticles,
  createArticle,
  removeArticle,
};
