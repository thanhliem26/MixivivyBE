"use strict";
import { uploadFileS3 } from "../utils/aws";
import { ROLE_APPLICATION } from "../utils/constant";
import { sendEmailAWSSignUp } from "./../utils/send-mail-aws";

const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const KeyTokenService = require("./token.service");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData, generateDoubleKey, deleteFIleUpload } = require("../utils");
const {
  BadRequestError,
  AuthFailureError,
  ForbiddenError,
} = require("../core/error.response");
const JWT = require("jsonwebtoken");
const fs = require("fs").promises;
class AccessService {
  static signUp = async ({ name, email, password }) => {
    const existingUser = await UserModel.findOne({
      email,
      deleted_at: null,
    }).lean();
    if (existingUser) {
      throw new BadRequestError("Error: Email already registered");
    }

    // Mã hóa mật khẩu
    const bcrypt = require("bcrypt");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = await UserModel.create({
      name,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      const token = await JWT.sign(
        { user_id: newUser.id, email },
        process.env.JWT_SECRET,
        {
          expiresIn: "2 days",
        }
      );

      // Gửi email xác nhận
      await sendEmailAWSSignUp({
        data: {
          email: email,
          fullName: name,
        },
        token: token,
      });

      return {
        code: 201,
        metadata: {
          user: { id: newUser._id, name: newUser.name, email: newUser.email },
          token,
        },
      };
    }

    return {
      code: 400,
      message: "User creation failed",
    };
  };

  static verifyEmail = async (payload) => {
    try {
      const decoded = await JWT.verify(payload?.token, process.env.JWT_SECRET);
      const userId = decoded.user_id;

      // Cập nhật trạng thái người dùng là đã xác nhận
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        {
          is_active: true,
        },
        { new: true }
      );

      if (!updatedUser) {
        throw new Error("User not found");
      }

      return {
        message: "Email verified successfully",
        user: updatedUser,
      };
    } catch (error) {
      throw error;
    }
  };

  /**
   *
   * @step
   * 1 - check email in dbs
   * 2 - match password
   * 3 - create PublicKey and PrivateKey save
   * 4 - generate tokens
   * 5 - get data return login
   */
  static login = async ({ email, password, refreshToken = null }) => {
    // 1. Kiểm tra email có tồn tại không
    const user = await UserModel.findOne({ email, deleted_at: null }).lean();
    if (!user) throw new AuthFailureError("User not found");

    // Kiểm tra trạng thái xác nhận email
    if (!user.is_active) {
      throw new AuthFailureError("Please verify your email before logging in");
    }
    // 2. So khớp mật khẩu
    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new AuthFailureError("Invalid password");

    // 3. Tạo cặp khóa JWT và trả về token
    const { publicKey, privateKey } = generateDoubleKey();
    const tokens = await createTokenPair({
      publicKey,
      privateKey,
      payload: { user_id: user._id, email, role_user: user.role_user },
    });

    await KeyTokenService.createKeyToken({
      privateKey,
      publicKey,
      user_id: user._id,
      refreshToken: tokens.refreshToken,
    });

    return {
      user: getInfoData({ field: ["_id", "name", "email"], object: user }),
      tokens,
    };
  };

  static loginCMS = async ({ email, password, refreshToken = null }) => {
    const user = await UserModel.findOne({ email, deleted_at: null }).lean();
    if (!user) throw new AuthFailureError("User not found");

    if (!user.is_active) {
      throw new AuthFailureError("Please verify your email before logging in");
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new AuthFailureError("Invalid password");

    if (user.role_user !== ROLE_APPLICATION.ADMIN) {
      throw new BadRequestError("You don't have permission");
    }

    const { publicKey, privateKey } = generateDoubleKey();
    const tokens = await createTokenPair({
      publicKey,
      privateKey,
      payload: { user_id: user._id, email, role_user: user.role_user },
    });

    await KeyTokenService.createKeyToken({
      privateKey,
      publicKey,
      user_id: user._id,
      refreshToken: tokens.refreshToken,
    });

    return {
      user: getInfoData({ field: ["_id", "name", "email"], object: user }),
      tokens,
    };
  };

  static logout = async (keyStore) => {
    if (keyStore.refreshToken) {
      await KeyTokenService.updateRefreshTokenStatus(
        keyStore._id,
        keyStore.refreshToken
      );
    }

    const result = await KeyTokenService.removeKeyById(keyStore._id);

    return result;
  };

  static handleRefreshTokenV2 = async ({ refreshToken, user, keyStore }) => {
    const { user_id, email } = user;
   
    // Kiểm tra refreshToken đã được sử dụng chưa
    if (keyStore.refreshTokenUsed.includes(refreshToken)) {
      await KeyTokenService.deleteKeyById(user_id);
      throw new ForbiddenError("Session expired. Please login again.");
    }

    if (keyStore.refreshToken !== refreshToken)
      throw new AuthFailureError("Invalid refresh token");

    const updatedUser = await UserModel.findOne({ email }).lean();
    if (!updatedUser) throw new AuthFailureError("User not found");

    // Tạo mới cặp token
    const tokens = await createTokenPair({
      publicKey: keyStore.publicKey,
      privateKey: keyStore.privateKey,
      payload: { user_id, email },
    });

    //update token
    await keyStore.updateOne({
      $set: {
        refreshToken: tokens.refreshToken,
      },
      $addToSet: {
        refreshTokenUsed: refreshToken,
      },
    });

    return {
      user,
      tokens,
    };
  };

  static uploadFileServiceS3 = async (file, data) => {
    if (!file || !data.nameFile) {
      throw new BadRequestError("File and nameFile is required!");
    }

    const pathImage = file.path;
    const nameImage = data.nameFile;

    try {
      const fileData = await fs.readFile(pathImage);
      const fileS3 = await uploadFileS3(fileData, nameImage);

      //delete file in folder upload
      deleteFIleUpload(pathImage);

      return fileS3;
    } catch (err) {
      throw err;
    }
  };
}

module.exports = AccessService;
