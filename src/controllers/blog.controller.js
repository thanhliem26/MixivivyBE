"use strict";

const {
  CREATED,
  DELETED,
  SuccessResponse,
  OK,
} = require("../core/succes.response");
const BlogService = require("../services/blog.service");

class BlogController {
  createBlog = async (req, res, next) => {
    new CREATED({
      message: "Blog created successfully!",
      metadata: await BlogService.createBlog(req.body),
    }).send(res);
  };

  updateBlog = async (req, res, next) => {
    new SuccessResponse({
      message: "Blog updated successfully",
      metadata: await BlogService.updateBlog(req.body),
    }).send(res);
  };

  deleteBlog = async (req, res, next) => {
    new DELETED({
      message: "Deleted blog success!",
      metadata: await BlogService.deleteBlog(req.query?.id),
    }).send(res);
  };

  getBlog = async (req, res, next) => {
    new SuccessResponse({
      message: "Get blog success",
      metadata: await BlogService.getBlogById(req.query.id),
    }).send(res);
  };

  getAllBlog = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list booking success",
      metadata: await BlogService.getAllBlog(req.query),
    }).send(res);
  };
}

module.exports = new BlogController();
