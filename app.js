const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter");
const { handleInternalErrors, send404 } = require("./controllers/errors");

app.use("/api", apiRouter);
app.use("/*", send404);

app.use(handleInternalErrors);

module.exports = app;
