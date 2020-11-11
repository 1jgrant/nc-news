const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter");
const {
  handlePSQLErrors,
  handleCustomErrors,
  handleInternalErrors,
  send404,
} = require("./controllers/errors");

app.use(express.json());
app.use("/api", apiRouter);
app.use("/*", send404);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handleInternalErrors);

module.exports = app;
