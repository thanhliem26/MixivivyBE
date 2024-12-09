"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const BookingModel = require("../models/booking.model");
const tourRepo = require("../models/repository/tour.repo");
const bookingRepo = require("../models/repository/booking.repo");
const accountBankRepo = require("../models/repository/accountBank.repo");
const { omit } = require("lodash");
const { convertDataPagination } = require("../utils");
const convertObjectId = require("../helper/convertObjectId");
const moment = require("moment");
const bookingModel = require("../models/booking.model");
const { generateQR } = require("../utils/generateQR");

class BookingService {
  static createBooking = async (user_id, payload) => {
    if (!payload.booking_date) {
      throw new BadRequestError("Booking date is required");
    }

    if (!payload.total) {
      throw new BadRequestError("Total is required");
    }

    if (moment().startOf("day").isAfter(payload.booking_date)) {
      throw new BadRequestError("Please select a future date");
    }

    const tour = await tourRepo.findTourById(convertObjectId(payload.tour_id));
    if (!tour) {
      throw new NotFoundError("tour not found");
    }
    const totalOfTour = tour.quantity;
    //booking in date
    const countBookingDate = await bookingRepo.countBookingsByTourIdAndDate(
      payload.tour_id,
      payload.booking_date
    );

    if (totalOfTour > countBookingDate + payload.total) {
      throw new BadRequestError(
        `This tour only has ${
          totalOfTour - countBookingDate
        } tickets left today`
      );
    }

    const accountBank = await accountBankRepo.findLowestOrderActiveAccount();

    const newBooking = await BookingModel.create({
      ...payload,
      user_id: user_id,
      location_to: tour.location_to,
      time_start: tour.time_start,
      price: tour.price * payload.total,
    });

    const qrCode = await generateQR({
      accountName: accountBank?.name,
      accountNo: accountBank?.bank_account_number,
      acqId: accountBank?.bank_id?.bin,
      addInfo: `Chuyển tiền đặt tour ${tour?.name}`,
      amount: tour.price * payload.total,
    })

    return {
      booking: newBooking,
      qrCode: qrCode,

    }
  };

  static updateBooking = async (payload) => {
    if (!payload.id) {
      throw new BadRequestError("Id is required!");
    }

    if (!payload.total) {
      throw new BadRequestError("Total is required");
    }

    if (!payload.booking_date) {
      throw new BadRequestError("Booking date is required");
    }

    if (moment().startOf("day").isAfter(payload.booking_date)) {
      throw new BadRequestError("Please select a future date");
    }

    const tour = await tourRepo.findTourById(convertObjectId(payload.tour_id));
    if (!tour) {
      throw new NotFoundError("tour not found");
    }
    const totalOfTour = tour.quantity;

    //booking in date
    const countBookingDate = await bookingRepo.countBookingsByTourIdAndDate(
      payload.tour_id,
      payload.booking_date
    );
    if (totalOfTour > countBookingDate + payload.total) {
      throw new BadRequestError(
        `This tour only has ${
          totalOfTour - countBookingDate
        } tickets left today`
      );
    }

    const dataUpdate = omit(payload, ["deleted_at", "id", "price"]);

    const updatedBooking = await bookingModel.findByIdAndUpdate(
      payload.id,
      { ...dataUpdate, price: tour.price * payload.total },
      { new: true }
    );

    if (!updatedBooking) {
      throw new NotFoundError("Booking not found");
    }

    return updatedBooking;
  };

  static deleteBooking = async (id) => {
    if (!id) {
      throw new BadRequestError("id is required");
    }

    const deletedBooking = await bookingRepo.deleteBookingById(id);

    if (!deletedBooking) {
      throw new BadRequestError("Booking not found");
    }

    return deletedBooking;
  };

  static getBookingById = async (id) => {
    if (!id) {
      throw new BadRequestError("Id is required");
    }

    const Booking = await bookingRepo.findBookingById(id);
    if (!Booking) {
      throw new BadRequestError("Booking not found");
    }

    return Booking;
  };

  static getAllBooking = async (payload) => {
    const page = payload?.page ?? 1;
    const perPage = payload?.perPage ?? 10;

    const search = payload?.search ?? "";
    console.log("🚀 ~ search:", search);

    const skip = (page - 1) * perPage;
    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { cccd: { $regex: search, $options: "i" } },
      ],
      deleted_at: null,
    };

    if (payload?.tour_id) {
      query["tour_id"] = payload.tour_id;
    }

    if (payload?.is_received) {
      query["is_received"] = payload.is_received;
    }

    const bookings = await BookingModel.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(perPage)
      .populate({
        path: "user_id",
        select: "-password -deleted_at",
        model: "User",
      })
      .populate({
        path: "tour_id",
        select: "-deleted_at",
        model: "Tour",
      })
      .lean();

    // Map lại dữ liệu để đổi field
    const formattedBookings = bookings.map((booking) => {
      booking.user = booking.user_id;
      booking.tour = booking.tour_id;
      delete booking.user_id;
      delete booking.tour_id;
      return booking;
    });

    const total = await BookingModel.countDocuments(query);
    const dataTable = convertDataPagination(
      formattedBookings,
      page,
      perPage,
      total
    );

    return dataTable;
  };
}

module.exports = BookingService;
