"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const blogModel = require("../models/blogs.model");
const blogRepo = require("../models/repository/blog.repo");
const { omit } = require("lodash");
const { convertDataPagination } = require("../utils");

class BlogService {
  static createBlog = async (payload) => {
    if (!payload.name) {
      throw new BadRequestError("Name is required");
    }

    const blog = await blogRepo.findByName(payload.name);
    if (blog) {
      throw new BadRequestError("Name blog is exits!");
    }
    const newBooking = await blogModel.create(payload);

    return newBooking;
  };

  static updateBlog = async (payload) => {
    if (!payload.id) {
      throw new BadRequestError("Id is required!");
    }

    const blog = await blogRepo.checkExitsBlogName(payload.id, payload.name);
    if (blog) {
      throw new BadRequestError("Name blog is exits!");
    }

    const dataUpdate = omit(payload, ["deleted_at", "id"]);

    const updatedBlog = await blogModel.findByIdAndUpdate(
      payload.id,
      dataUpdate,
      { new: true }
    );

    if (!updatedBlog) {
      throw new NotFoundError("Blog not found");
    }

    return updatedBlog;
  };

    static deleteBlog = async (id) => {
      if (!id) {
        throw new BadRequestError("id is required");
      }

      const deletedBlog = await blogRepo.deleteBlogById(id);

      if (!deletedBlog) {
        throw new BadRequestError("Booking not found");
      }

      return deletedBlog;
    };

    static getBlogById = async (id) => {
      if (!id) {
        throw new BadRequestError("Id is required");
      }

      const Booking = await blogRepo.findBlogById(id);
      if (!Booking) {
        throw new BadRequestError("Booking not found");
      }

      return Booking;
    };

    static getAllBlog = async (payload) => {
      const page = payload?.page ?? 1;
      const perPage = payload?.perPage ?? 10;

      const search = payload?.search ?? "";

      const skip = (page - 1) * perPage;
      const query = {
        $or: [
          { name: { $regex: search, $options: "i" } },
        ],
        deleted_at: null,
      };

      const blogs = await blogModel.find(query)
        .sort({ created_at: -1 })
        .skip(skip)
        .limit(perPage)
        .exec();


      const total = await blogModel.countDocuments(query);
      const dataTable = convertDataPagination(blogs, page, perPage, total);

      return dataTable;
    };
}

module.exports = BlogService;
