const db = require('../db/connection');

const fetchArticleById = (articleId) => {
  return db
    .select('articles.*')
    .from('articles')
    .where('articles.article_id', articleId.article_id)
    .count({ comment_count: 'comment_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .returning('*')
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

const fetchCommentsByArticleId = (articleId, { sort_by, order }) => {
  const validColumns = ['comment_id', 'votes', 'created_at', 'author', 'body'];
  const sortColumn = validColumns.includes(sort_by) ? sort_by : 'created_at';
  const orderDir = order === 'asc' ? 'asc' : 'desc';
  return db
    .select('comment_id', 'votes', 'created_at', 'author', 'body')
    .from('comments')
    .where(articleId)
    .orderBy(sortColumn, orderDir);
};

const fetchArticles = ({ sort_by, order, author, topic }) => {
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
  // query the db
  return db
    .select('articles.*')
    .from('articles')
    .count({ comment_count: 'comment_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .orderBy(sortColumn, orderDir)
    .modify((query) => {
      if (author) query.where({ 'articles.author': author });
      if (topic) query.where({ topic: topic });
    })
    .then((articles) => {
      // when there are no articles in the response, we need to check if the
      // author exists or not and handle appropriately
      if (articles.length === 0) {
        return Promise.all([articles, checkAuthorExists(author)]);
      } else return [articles, true];
    })
    .then(([articles, authorExists]) => {
      if (!authorExists) {
        return Promise.reject({ status: 404, msg: 'Author not found' });
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
      console.log(delCount);
    });
};

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
