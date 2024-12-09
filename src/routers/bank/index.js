'use strict'

const express = require('express');
const BankController = require('../../controllers/bank.controller');
const router = express.Router();
const  asyncHandler = require('../../helper/asyncHandler');

// authentication token
router.get("/list", asyncHandler(BankController.getAllBank));

module.exports = router;