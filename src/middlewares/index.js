const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const express = require("express");
const bodyParser = require("body-parser");

module.exports = function (app) {
  app.use(morgan("dev"));
  app.use(helmet());
  app.use(compression());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  //encode data when use method post
  app.use(express.json({ limit: "50mb" }));
  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(express.urlencoded({ extended: true }));
};
