import express from "express";
import cors from "cors";
require("dotenv").config();

const middlewares = require('./middlewares');

const app = express();
//init middlewares
middlewares(app);

const corsOptions = {
  origin: process.env.URL_FE_CORS,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

//init db
require('./dbs/init.mongodb');

//init route
app.use("/", require("./routers"));

//handle errors
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  const statusCode = error.status || 500;
  console.error("Error details:", error); // Logs the full error details
  
  return res.status(statusCode).json({
    status: "error",
    code: statusCode,
    message: error.message || "Internal Server Error",
  });
});

//handle errors

module.exports = app;
