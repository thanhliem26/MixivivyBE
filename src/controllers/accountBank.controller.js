"use strict";

const {
  CREATED,
  DELETED,
  SuccessResponse,
  OK,
} = require("../core/succes.response");
const AccountBankService = require("../services/accountBank.service");

class BookingController {
    createAccountBank = async (req, res, next) => {
    new CREATED({
      message: "Account bank created successfully!",
      metadata: await AccountBankService.createAccountBank(req.body),
    }).send(res);
  };

  updateAccountBank = async (req, res, next) => {
    new SuccessResponse({
      message: "Account bank updated successfully",
      metadata: await AccountBankService.updateAccountBank(req.body),
    }).send(res);
  };

  deleteAccountBank = async (req, res, next) => {
    new DELETED({
      message: "Deleted account bank success!",
      metadata: await AccountBankService.deleteAccountBank(req.query?.id),
    }).send(res);
  };

  getAccountBankById = async (req, res, next) => {
    new SuccessResponse({
      message: "Get account bank success",
      metadata: await AccountBankService.getAccountBankById(req.query.id),
    }).send(res);
  };

  getAllAccountBank = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list account bank success",
      metadata: await AccountBankService.getAllAccountBank(req.query),
    }).send(res);
  };
}

module.exports = new BookingController();
