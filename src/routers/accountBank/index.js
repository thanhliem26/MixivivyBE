'use strict'

const express = require('express');
const AccountBankController = require('../../controllers/accountBank.controller');
const router = express.Router();
const  asyncHandler = require('../../helper/asyncHandler');
const { isAdmin, authentication } = require('../../auth/authUtils');

// authentication token
router.use(isAdmin);
router.post("/cms/create", asyncHandler(AccountBankController.createAccountBank));
router.get("/cms/list", asyncHandler(AccountBankController.getAllAccountBank));
router.get("/cms", asyncHandler(AccountBankController.getAccountBankById));
router.put("/cms/update", asyncHandler(AccountBankController.updateAccountBank));
router.delete("/cms/delete", asyncHandler(AccountBankController.deleteAccountBank));

module.exports = router;