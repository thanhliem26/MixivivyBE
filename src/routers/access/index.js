'use strict'

const express = require('express');
const AccessController = require('../../controllers/access.controller');
const router = express.Router();
const  asyncHandler = require('../../helper/asyncHandler');
const { authentication, authenticationV2 } = require('../../auth/authUtils');

import multer from 'multer';
const upload = multer({ dest: 'uploads/' });

router.post('/signUp', asyncHandler(AccessController.signUp));
router.post('/login', asyncHandler(AccessController.signIn));
router.post('/login-cms', asyncHandler(AccessController.signInCMS));

router.post("/verify-email", asyncHandler(AccessController.verifyEmail));
// authentication token
router.use(authentication);
router.post('/uploadFIleS3', upload.single('file'), asyncHandler(AccessController.uploadFileS3)); 

router.use(authenticationV2);

router.post('/logOut', asyncHandler(AccessController.logOut));
router.post('/handleRefreshToken', asyncHandler(AccessController.handleRefreshToken));

module.exports = router;