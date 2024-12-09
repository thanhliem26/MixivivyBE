'use strict'

const express = require('express');
const UserController = require('../../controllers/user.controller');
const router = express.Router();
const  asyncHandler = require('../../helper/asyncHandler');
const { authentication, isAdmin } = require('../../auth/authUtils');

//authentication token
router.use(authentication);
router.get('/me', asyncHandler(UserController.userInfo));
router.put('/changePassword', asyncHandler(UserController.changePasswordUser));
router.put('/update-me', asyncHandler(UserController.updateMe));

// //role admin
router.use(isAdmin);
router.put('/cms/changePassword', asyncHandler(UserController.changePassword));
router.get('/cms/list', asyncHandler(UserController.getAllUsers));
router.put('/cms/update', asyncHandler(UserController.updateUser));
router.get('/cms', asyncHandler(UserController.getUserById));
router.delete('/cms/delete', asyncHandler(UserController.deleteUser));

module.exports = router;