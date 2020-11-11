const handlePSQLErrors = (err, req, res, next) => {
  const errorsRef = {
    '22P02': {
      status: 400,
      msg: 'Bad Request',
    },
    '23503': {
      status: 422,
      msg: 'Unprocessable Entity',
    },
    '23502': {
      status: 400,
      msg: 'Bad Request: Incorrect comment format',
    },
  };
  if (errorsRef[err.code]) {
    res
      .status(errorsRef[err.code].status)
      .send({ msg: errorsRef[err.code].msg });
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
