"use strict";

const {
  CREATED,
  UPDATED,
  DELETED,
  SuccessResponse,
  OK,
} = require("../core/succes.response");
const UserService = require("../services/user.service");

class UserController {
  updateUser = async (req, res, next) => {
    new UPDATED({
      message: "Update OK!",
      metadata: await UserService.updateUser(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };

  updateMe = async (req, res, next) => {
    new UPDATED({
      message: "Update userInfo OK!",
      metadata: await UserService.updateMe(req.keyStore.user_id, res.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };

  changePassword = async (req, res, next) => {
    new UPDATED({
      message: "Update password success!",
      metadata: await UserService.changePassword(req.body),
      options: {
        limit: 10,
      },
    }).send(res);
  };

  changePasswordUser = async (req, res, next) => {
    new UPDATED({
      message: "Update password success!",
      metadata: await UserService.changePassword({id: req.keyStore.user_id, password: req.body?.password}),
      options: {
        limit: 10,
      },
    }).send(res);
  };

  deleteUser = async (req, res, next) => {
    new DELETED({
      message: "Deleted OK!",
      metadata: await UserService.deleteUser(req.query),
      options: {
        limit: 10,
      },
    }).send(res);
  };

  getUserById = async (req, res, next) => {
    try {
      new SuccessResponse({
        message: "Get user success!",
        metadata: await UserService.getUserById(req.query?.id),
        options: {
          limit: 10,
        },
      }).send(res);
    } catch (error) {
      next(error);
    }
  };

  userInfo = async (req, res, next) => {
    new SuccessResponse({
      message: "get userInfo success!",
      metadata: await UserService.getUserById(req.keyStore.user_id),
    }).send(res);
  };

  getAllUsers = async (req, res, next) => {
    new SuccessResponse({
      message: "get all userInfo success!",
      metadata: await UserService.getAllUsers(req.query),
      options: {
        ...req.query
      },
    }).send(res);
  };
}

module.exports = new UserController();
