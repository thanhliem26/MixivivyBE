"use strict";

const BankModel = require("../models/bank.model");

class BankService {
  static getAllBank = async (payload) => {
    const banks = await BankModel.find();

    return banks;
  };
}

module.exports = BankService;
