"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';
// Declare the Schema of the Mongo model
var userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    index: true,
     match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  name: {
    type: String,
    required: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    default: null,
  },
  address: {
    type: String,
    default: null,
  },
  dateOfBirth: {
    type: Date,
    default: null,
  },
  sex: {
    type: String,
    default: "male",
    enum: ["male", "female", "other"]
  },
  role_user: {
    type: String,
    default: "customer",
    enum: ["admin", "customer"]
  },
  avatar: {
    type: String,
    default: null
  },
  is_active: {
    type: Boolean,
    default: false
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  deleted_at: {
    type: Date,
    default: null
  },
  token: { type: String },
}, {
    timestamps: false,
    collection: COLLECTION_NAME
});

userSchema.pre('save', function (next) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
    return next(new Error('Invalid email format'));
  }
  next();
});

userSchema.pre(['findOneAndUpdate', 'findByIdAndUpdate'], function (next) {
  const update = this.getUpdate();

  // Kiểm tra nếu trường `email` được cập nhật
  if (update.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(update.email)) {
    return next(new Error('Invalid email format'));
  }

  next();
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, userSchema);
