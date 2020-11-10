const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter");
const {
  handleCustomErrors,
  handleInternalErrors,
  send404,
} = require("./controllers/errors");

app.use("/api", apiRouter);
app.use("/*", send404);

app.use(handleCustomErrors);
app.use(handleInternalErrors);

module.exports = app;
