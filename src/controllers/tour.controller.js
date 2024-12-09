"use strict";

const {
  CREATED,
  DELETED,
  SuccessResponse,
  OK,
} = require("../core/succes.response");
const TourService = require("../services/tour.service");

class TourController {
  createTour = async (req, res, next) => {
    new CREATED({
      message: "Tour created successfully!",
      metadata: await TourService.createTour(req.body),
    }).send(res);
  };

  updateTour = async (req, res, next) => {
    new OK({
      message: "Tour updated successfully",
      metadata: await TourService.updateTour(req.body),
    }).send(res);
  };

  deleteTour = async (req, res, next) => {
    new DELETED({
      message: "Deleted tour success!",
      metadata: await TourService.deleteTour(req.query?.id),
    }).send(res);
  };

  getTourById = async (req, res, next) => {
    new OK({
      message: "Get tour success",
      metadata: await TourService.getTourById(req.query.id),
    }).send(res);
  };

  getAllTours = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list tour success",
      metadata: await TourService.getAllTours(req.query),
      options: {
        ...req.query
      }
    }).send(res);
  };

  getAllTourApplication = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list tour success",
      metadata: await TourService.getAllTourApplication(req.query),
      options: {
        ...req.query
      }
    }).send(res);
  };
}

module.exports = new TourController();
