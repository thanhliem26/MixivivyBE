"use strict";

const {
  SuccessResponse,
} = require("../core/succes.response");
const BankService = require("../services/bank.service");

class BankController {


    getAllBank = async (req, res, next) => {
    new SuccessResponse({
      message: "Get list bank success",
      metadata: await BankService.getAllBank(req.query),
    }).send(res);
  };
}

module.exports = new BankController();
