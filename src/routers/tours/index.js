'use strict'

const express = require('express');
const TourController = require('../../controllers/tour.controller');
const router = express.Router();
const  asyncHandler = require('../../helper/asyncHandler');
const { isAdmin, authentication } = require('../../auth/authUtils');

// authentication token
router.get("/detail", asyncHandler(TourController.getTourById));
router.get("/list", asyncHandler(TourController.getAllTourApplication));

router.use(isAdmin);
router.get("/cms/list", asyncHandler(TourController.getAllTours));
router.get("/cms", asyncHandler(TourController.getTourById));
router.post("/cms/create", asyncHandler(TourController.createTour));
router.put("/cms/update", asyncHandler(TourController.updateTour));
router.delete("/cms/delete", asyncHandler(TourController.deleteTour));

module.exports = router;