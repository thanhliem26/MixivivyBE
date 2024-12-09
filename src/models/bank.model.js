"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Bank";
const COLLECTION_NAME = "Banks";
// Declare the Schema of the Mongo model
var bankSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
    },
    code: {
      type: String,
      required: true,
    },
    bin: {
      type: String,
      required: true,
    },
    shortName: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      default: Date.now,
    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: false,
    collection: COLLECTION_NAME,
  }
);

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, bankSchema);
