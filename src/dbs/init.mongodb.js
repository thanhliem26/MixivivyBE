"use strict";
//Pattern Singleton
const mongoose = require("mongoose");
const connectString = process.env.CONNECT_STRING_MG;

class Database {
  constructor() {
    this.connect();
  }

  connect(type = "mongodb") {
    if (1 === 1) {
      mongoose.set("debug", true);
      mongoose.set("debug", { color: true });
    }

    mongoose
      .connect(connectString)
      .then((_) => {
        console.log("connected mongoDB Success");
      })
      .catch((err) => {
        console.log("Error Connect MongoDB", err);
      });
  }

  static getInstance() {
    if(!Database.instance) {
      Database.instance = new Database();
    }

    return Database.instance;
  }
}

//init one connect DB
const initMongoDB = Database.getInstance();
module.exports = initMongoDB;
