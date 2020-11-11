const handlePSQLErrors = (err, req, res, next) => {
  const errorsRef = {
    '22P02': 'Bad Request',
    '23503': 'Bad Request: Article does not exist',
  };
  if (errorsRef[err.code]) {
    res.status(400).send({ msg: errorsRef[err.code] });
  } else {
    next(err);
  }
};

const handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

const handleInternalErrors = (err, req, res, next) => {
  console.log('unhandled internal error>>>', err);
  res.status(500).send({ msg: 'Internal Server Error' });
};

const send404 = (req, res, next) => {
  res.status(404).send({ msg: 'Route not found' });
};

const send405 = (req, res, next) => {
  res.status(405).send({ msg: 'Invalid Method' });
};
module.exports = {
  handlePSQLErrors,
  handleCustomErrors,
  handleInternalErrors,
  send404,
  send405,
};
