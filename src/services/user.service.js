"use strict";

const userModel = require("../models/user.model");

const { convertDataPagination } = require("../utils");
const { BadRequestError } = require("../core/error.response");
const userRepo = require("../models/repository/user.repo");
const convertObjectId = require("../helper/convertObjectId");
const { omit } = require("lodash");

class UserService {
  static updateUser = async (payload) => {
    if (!payload.id) {
      throw new BadRequestError("Missing user ID");
    }

    const dataUpdate = omit(payload, [
      "password",
      "role_user",
      "deleted_at",
      "id",
    ]);

    const updatedUser = await userModel.findByIdAndUpdate(
      payload.id,
      dataUpdate,
      { new: true } // Trả về document sau khi cập nhật
    );

    if (!updatedUser) {
      throw new BadRequestError("User not found");
    }

    return updatedUser;
  };

  static updateMe = async (id, payload) => {
    if (!id) {
      throw new BadRequestError("Missing user ID");
    }

    const dataUpdate = omit(payload, [
      "password",
      "role_user",
      "deleted_at",
      "id",
      "is_active"
    ]);

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      dataUpdate,
      { new: true } // Trả về document sau khi cập nhật
    );

    if (!updatedUser) {
      throw new BadRequestError("User not found");
    }

    return updatedUser;
  };

  static changePassword = async ({ id, password }) => {
    if (!id) {
      throw new BadRequestError("Missing user ID");
    }

    if (!password) {
      throw new BadRequestError("Missing password");
    }

    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );

    if (!updatedUser) {
      throw new BadRequestError("User not found");
    }

    return updatedUser;
  };

  static deleteUser = async (payload) => {
    const newUser = await userRepo.deleteUserById(convertObjectId(payload?.id));

    return newUser;
  };

  static getUserById = async (id) => {
    return await userRepo.findById(convertObjectId(id));
  };

  static getAllUsers = async (payload) => {
    const page = payload?.page ?? 1;
    const perPage = payload?.perPage ?? 10;

    const search = payload?.search ?? "";

    const skip = (page - 1) * perPage;
    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ],
      deleted_at: null,
    };
    if (payload?.is_active) {
      query["is_active"] = payload?.is_active;
    }

    const users = await userModel
      .find(query, { password: 0 })
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(perPage)
      .exec();

    const total = await userModel.countDocuments(query);
    const dataTable = convertDataPagination(users, page, perPage, total);

    return dataTable;
  };
}

module.exports = UserService;
