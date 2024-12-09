const bookingModel = require("../booking.model");

const findBookingById = async (id) => {
  try {
    return await bookingModel
      .findOne({
        _id: id,
        deleted_at: null,
      })
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
      .lean()
      .then((booking) => {
        if (!booking) return null;

        booking.user = booking.user_id;
        booking.tour = booking.tour_id;
        delete booking.user_id;
        delete booking.tour_id;
        return booking;
      });
  } catch (error) {
    throw new Error(error.message);
  }
};

const countBookingsByTourIdAndDate = async (tour_id, date) => {
  try {
    const count = await bookingModel.countDocuments({
      tour_id,
      booking_date: {
        $gte: new Date(date).setHours(0, 0, 0, 0),
        $lt: new Date(date).setHours(23, 59, 59, 999),
      },
      is_received: true,
      deleted_at: null,
    });

    return count;
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteBookingById = async (id) => {
  try {
    return await bookingModel.findOneAndUpdate(
      {
        _id: id,
      },
      { deleted_at: new Date() }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  countBookingsByTourIdAndDate,
  findBookingById,
  deleteBookingById,
};
