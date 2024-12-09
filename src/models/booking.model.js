"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Booking";
const COLLECTION_NAME = "Bookings";
// Declare the Schema of the Mongo model
var bookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User',
      required: true,
      index: true,
    },
    tour_id: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Tour',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      required: true,
    },
    cccd: {
      type: String,
    },
    booking_date: {
      type: Date,
      required: true,
    },
    location_to: {
      type: String,
      required: true,
    },
    time_start: {
      type: String,
      required: true,
    },
    total: { // số lượng user 
      type: Number,
      require: true,
      default: 1,
    },
    price: {
      type: Number,
      required: true,
    },
    is_received: { //trạng thái booking được thanh toán
      type: Boolean,
      required: true,
      default: false,
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

bookingSchema.pre('save', function (next) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
    return next(new Error('Invalid email format'));
  }
  next();
});

bookingSchema.pre(['findOneAndUpdate', 'findByIdAndUpdate'], function (next) {
  const update = this.getUpdate();

  // Kiểm tra nếu trường `email` được cập nhật
  if (update.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(update.email)) {
    return next(new Error('Invalid email format'));
  }

  next();
});

//Export the model
module.exports = mongoose.model(DOCUMENT_NAME, bookingSchema);
