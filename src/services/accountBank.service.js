"use strict";

const { BadRequestError, NotFoundError } = require("../core/error.response");
const BookingModel = require("../models/booking.model");
const accountBankRepo = require("../models/repository/accountBank.repo");
const bookingRepo = require("../models/repository/booking.repo");
const { omit } = require("lodash");
const { convertDataPagination } = require("../utils");
const convertObjectId = require("../helper/convertObjectId");
const moment = require("moment");
const AccountBankModel = require("../models/accountBank.model");

class AccountBankService {
  static createAccountBank = async (payload) => {
    const accountBank = await accountBankRepo.findAccountBankByOrder(
      payload.order
    );
    if (accountBank) {
      throw new BadRequestError(
        "Order is exist, please select order different"
      );
    }

    const newBooking = await AccountBankModel.create(payload);

    return newBooking;
  };

  static updateAccountBank = async (payload) => {
    if (!payload.id) {
      throw new BadRequestError("Id is required!");
    }

    if (!payload.order) {
      throw new BadRequestError("Order is required");
    }

    const accountBank = await accountBankRepo.checkExitsAccountBankOrder(
      payload.id,
      payload.order
    );
    if (accountBank) {
      throw new BadRequestError(
        "Order is exist, please select order different"
      );
    }

    const dataUpdate = omit(payload, ["deleted_at", "id"]);

    const updatedAccountBank = await AccountBankModel.findByIdAndUpdate(
      payload.id,
      dataUpdate,
      { new: true }
    );

    if (!updatedAccountBank) {
      throw new NotFoundError("Account bank not found");
    }

    return updatedAccountBank;
  };

  static deleteAccountBank = async (id) => {
    if (!id) {
      throw new BadRequestError("id is required");
    }

    const deleteAccountBank = await accountBankRepo.deleteAccountBankById(id);

    if (!deleteAccountBank) {
      throw new BadRequestError("AccountBank not found");
    }

    return deleteAccountBank;
  };

  static getAccountBankById = async (id) => {
    if (!id) {
      throw new BadRequestError("Id is required");
    }

    const AccountBank = await accountBankRepo.findAccountBankById(id);
    if (!AccountBank) {
      throw new BadRequestError("AccountBank not found");
    }

    return AccountBank;
  };

  static getAllAccountBank = async (payload) => {
    const page = payload?.page ?? 1;
    const perPage = payload?.perPage ?? 10;

    const search = payload?.search ?? "";

    const skip = (page - 1) * perPage;
    const query = {
      $or: [
        { name: { $regex: search, $options: "i" } },
        { bank_account_number: { $regex: search, $options: "i" } },
      ],
      deleted_at: null,
    };

    if (payload?.bank_id) {
      query["bank_id"] = payload.bank_id;
    }

    if (payload?.is_active) {
      query["is_active"] = payload.is_active;
    }

    const accountBanks = await AccountBankModel.find(query)
      .sort({ created_at: -1 })
      .skip(skip)
      .limit(perPage)
      .populate({
        path: "bank_id",
        model: "Bank",
      })
      .lean();

    // Map lại dữ liệu để đổi field
      const formattedAccountBank = accountBanks.map((accountBank) => {
        accountBank.bank = accountBank.bank_id;

        delete accountBank.bank_id;
    
        return accountBank;
      });

    const total = await AccountBankModel.countDocuments(query);
    const dataTable = convertDataPagination(formattedAccountBank, page, perPage, total);

    return dataTable;
  };
}

module.exports = AccountBankService;
