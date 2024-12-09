"use strict";

const {
  CREATED,
  DELETED,
  SuccessResponse,
  OK,
} = require("../core/succes.response");
const BookingService = require("../services/booking.service");

class BookingController {
  createBooking = async (req, res, next) => {
    new CREATED({
      message: "Booking created successfully!",
      metadata: await BookingService.createBooking(req.keyStore.user_id, req.body),
    }).send(res);
  };

  updateBooking = async (req, res, next) => {
    new SuccessResponse({
      message: "Booking updated successfully",
      metadata: await BookingService.updateBooking(req.body),
    }).send(res);
  };

  deleteBooking = async (req, res, next) => {
    new DELETED({
      message: "Deleted booking success!",
      metadata: await BookingService.deleteBooking(req.query?.id),
    }).send(res);
  };

  getBookingById = async (req, res, next) => {
    new SuccessResponse({
      message: "Get booking success",
      metadata: await BookingService.getBookingById(req.query.id),
    }).send(res);
  };

  getAllBooking = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list booking success",
      metadata: await BookingService.getAllBooking(req.query),
    }).send(res);
  };
}

module.exports = new BookingController();
