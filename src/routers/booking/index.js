'use strict'

const express = require('express');
const BookingController = require('../../controllers/booking.controller');
const router = express.Router();
const  asyncHandler = require('../../helper/asyncHandler');
const { isAdmin, authentication } = require('../../auth/authUtils');

// authentication token
router.use(authentication);
router.post("/create", asyncHandler(BookingController.createBooking));

router.use(isAdmin);
router.get("/cms/list", asyncHandler(BookingController.getAllBooking));
router.get("/cms", asyncHandler(BookingController.getBookingById));
router.put("/cms/update", asyncHandler(BookingController.updateBooking));
router.delete("/cms/delete", asyncHandler(BookingController.deleteBooking));

module.exports = router;