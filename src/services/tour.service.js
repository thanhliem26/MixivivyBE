"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const TourModal = require("../models/tour.model");
const tourRepo = require("../models/repository/tour.repo");
const { omit } = require("lodash");
const tourModel = require("../models/tour.model");
const { convertDataPagination } = require("../utils");
const convertObjectId = require("../helper/convertObjectId");
class TourService {
  static createTour = async (payload) => {
    if (!payload?.name) {
      throw new BadRequestError("Name is required");
    }

    const tour = await tourRepo.findTourByName(payload.name);
    if (tour) {
      throw new BadRequestError("Tour name is exist, please change name tour!");
    }

    const newTour = await TourModal.create(payload);
    return newTour;
  };

  static updateTour = async (payload) => {
    if (!payload.id) {
      throw new BadRequestError("Missing tour ID");
    }

    const dataUpdate = omit(payload, ["deleted_at", "id"]);

    const updatedTour = await TourModal.findByIdAndUpdate(
      payload.id,
      dataUpdate,
      { new: true }
    );

    if (!updatedTour) {
      throw new NotFoundError("Tour not found");
    }

    return updatedTour;
  };

  static deleteTour = async (id) => {
    if (!id) {
      throw new BadRequestError("Missing tour ID");
    }

    const deletedTour = await tourRepo.deleteTourById(id);

    if (!deletedTour) {
      throw new BadRequestError("Tour not found");
    }

    return deletedTour;
  };

  static getTourById = async (id) => {
    try {
      if (!id) {
        throw new BadRequestError("Missing tour ID");
      }

      const tour = await tourModel.aggregate([
        { $match: { _id: convertObjectId(id) } },
        {
          $lookup: {
            from: "Bookings", 
            localField: "_id", 
            foreignField: "tour_id",
            as: "bookings",
          },
        },
        {
          $addFields: {
            countBooked: { $size: "$bookings" }, 
          },
        },
        {
          $project: {
            bookings: 0,
          },
        },
      ]);
  
      if (!tour || tour.length === 0) {
        throw new BadRequestError("Tour not found");
      }
  
      return tour[0];
    } catch (error) {
      throw new Error(`Error fetching tour: ${error.message}`);
    }
  };

  static getAllTours = async (payload) => {
    const page = payload?.page ?? 1;
    const perPage = payload?.perPage ?? 10;
    const priceFrom = payload?.price_from; 
    const priceTo = payload?.price_to;

    const search = payload?.search ?? "";

    const skip = (page - 1) * perPage;
    const query = {
      $or: [{ name: { $regex: search, $options: "i" } }],
      deleted_at: null,
    };

    if (priceFrom !== undefined || priceTo !== undefined) {
      query.price = {};
      if (priceFrom !== undefined) {
        query.price.$gte = priceFrom;
      }
      if (priceTo !== undefined) {
        query.price.$lte = priceTo;
      }
    }

    if (payload?.is_active) {
      query["is_active"] = payload?.is_active;
    }

    const tours = await tourModel.find(query).sort({ created_at: -1 }).skip(skip).limit(perPage).exec();

    const total = await tourModel.countDocuments(query);
    const dataTable = convertDataPagination(tours, page, perPage, total);

    return dataTable;
  };

  static getAllTourApplication = async (payload) => {
    const page = payload?.page ?? 1;
    const perPage = payload?.perPage ?? 10;
    const priceFrom = payload?.price_from; 
    const priceTo = payload?.price_to;

    const search = payload?.search ?? "";

    const skip = (page - 1) * perPage;
    const query = {
      $or: [{ name: { $regex: search, $options: "i" } }],
      is_active: true,
      deleted_at: null,
    };

    if (priceFrom !== undefined || priceTo !== undefined) {
      query.price = {};
      if (priceFrom !== undefined) {
        query.price.$gte = Number(priceFrom);
      }
      if (priceTo !== undefined) {
        query.price.$lte = Number(priceTo);
      }
    }

    console.log("query", query)

    const tours = await tourModel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: "Bookings",
          localField: "_id", 
          foreignField: "tour_id", 
          as: "bookings", 
          pipeline: [
            { $match: { is_received: true } },
          ],
        },
      },
      {
        $addFields: {
          bookingCount: { $size: "$bookings" }, 
        },
      },
      {
        $sort: { bookingCount: -1 }, 
      },
      {
        $project: {
          bookings: 0, 
        },
      },
      {
        $skip: skip, 
      },
      {
        $limit: perPage, 
      },
    ]);

    const total = await tourModel.countDocuments(query);
    const dataTable = convertDataPagination(tours, page, perPage, total);
   
    return dataTable;
  };
}

module.exports = TourService;
