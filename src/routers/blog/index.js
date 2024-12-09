'use strict'

const express = require('express');
const BlogController = require('../../controllers/blog.controller');
const router = express.Router();
const  asyncHandler = require('../../helper/asyncHandler');
const { isAdmin } = require('../../auth/authUtils');

// authentication token

router.use(isAdmin);
router.post("/cms/create", asyncHandler(BlogController.createBlog));
router.get("/cms/list", asyncHandler(BlogController.getAllBlog));
router.get("/cms", asyncHandler(BlogController.getBlog));
router.put("/cms/update", asyncHandler(BlogController.updateBlog));
router.delete("/cms/delete", asyncHandler(BlogController.deleteBlog));

module.exports = router;