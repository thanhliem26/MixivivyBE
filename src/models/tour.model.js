"use strict";

const mongoose = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Tour";
const COLLECTION_NAME = "Tours";
// Declare the Schema of the Mongo model
var tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      index: true,
    },
    departure_point: { //điểm khởi hành
      type: String,
      required: true, 
    },
    time_tour: {
      type: Number, // thời gian tour(đơn vị giờ)
      required: true
    },
    images: {
      type: Array,
      default: [],
    },
    price: { 
      type: Number,
      default: null,
      required: true,
    },
    description: {
      type: String,
      default: null,
    },
    quantity: { //tổng user có thể có trong một tour đặt trong ngày
      type: Number,
      default: null,
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
      required: true,
    },
    location_to: { // địa điểm tour tới
      type: String,
      required: true, 
    },
    time_start: {
      type: String, // thời gian khỏi hành
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
module.exports = mongoose.model(DOCUMENT_NAME, tourSchema);
