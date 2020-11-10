const express = require("express");
const app = express();
const apiRouter = require("./routes/apiRouter");
const { send404 } = require("./controllers/errors");

app.use("/api", apiRouter);
app.use("/*", send404);

module.exports = app;
