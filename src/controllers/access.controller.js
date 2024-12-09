"use strict";

const { CREATED, SuccessResponse, OK } = require("../core/succes.response");
const AccessService = require("../services/access.service");

class AccessController {
  signUp = async (req, res, next) => {
    new CREATED({
      message: "REgistered OK!",
      metadata: await AccessService.signUp(req.body),
    }).send(res);
  };

  verifyEmail = async (req, res, next) => {
    new CREATED({
      message: "Verify success!",
      metadata: await AccessService.verifyEmail(req.body),
    }).send(res);
  };

  signIn = async (req, res, next) => {
    new SuccessResponse({
      message: "Sign In success",
      metadata: await AccessService.login(req.body),
    }).send(res);
  };

  signInCMS = async (req, res, next) => {
    new SuccessResponse({
      message: "Sign In success",
      metadata: await AccessService.loginCMS(req.body),
    }).send(res);
  };

  logOut = async (req, res, next) => {
    new OK({
      message: "Logout success",
      metadata: await AccessService.logout(req.keyStore),
    }).send(res);
  };

  handleRefreshToken = async (req, res, next) => {
    new OK({
      message: "Get token success",
      metadata: await AccessService.handleRefreshTokenV2({
        refreshToken: req.refreshToken,
        user: req.user,
        keyStore: req.keyStore,
      }),
    }).send(res);
  };

  uploadFileS3 = async (req, res, next) => {
    new CREATED({
        message: 'upload file success!',
        metadata: await AccessService.uploadFileServiceS3(req.file, req.body),
    }).send(res)
}
}

module.exports = new AccessController();
