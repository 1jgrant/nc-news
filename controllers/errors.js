const handleInternalErrors = (err, req, res, next) => {
  console.log("unhandled internal error>>>", err);
  res.status(500).send({ msg: "Internal Server Error" });
};

const send404 = (req, res, next) => {
  res.status(404).send({ msg: "Route not found" });
};

module.exports = { handleInternalErrors, send404 };
