const handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(er.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

const handleInternalErrors = (err, req, res, next) => {
  console.log("unhandled internal error>>>", err);
  res.status(500).send({ msg: "Internal Server Error" });
};

const send404 = (req, res, next) => {
  res.status(404).send({ msg: "Route not found" });
};

const send405 = (req, res, next) => {
  res.status(405).send({ msg: "Invalid Method" });
};
module.exports = { handleCustomErrors, handleInternalErrors, send404, send405 };
