'use strict'

const convertObjectId = require("../helper/convertObjectId");
const keyTokenModel = require("../models/tokens.model");
class TokenService {
    static createKeyToken = async ({ user_id, publicKey, privateKey, refreshToken}) => {
        try {
            const filter = { user_id: user_id};
            const update = { publicKey, privateKey, refreshTokenUsed: [], refreshToken};
            const options = { upsert: true, new: true}

            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);
            return tokens ;
        } catch(error) {
            throw error;
        }
    }

    static findByUserId = async (user_id) => {
        return await keyTokenModel.findOne({user_id: convertObjectId(user_id)});
    }

    static removeKeyById = async (id) => {
        return await keyTokenModel.deleteOne({_id: id});
    }

    static findByRefreshTokenUsed = async ( refreshToken ) => {
        return await keyTokenModel.findOne({refreshTokenUsed: refreshToken})
    }

    static deleteKeyById = async ( user_id ) => {
        return await keyTokenModel.deleteOne({ user: convertObjectId(user_id)})
    }

    static findByRefreshToken = async ( refreshToken ) => {
        return await keyTokenModel.findOne({ refreshToken });
    }
    // Trong TokenService
    static updateRefreshTokenStatus = async (user_id, refreshToken) => {
        try {
            await keyTokenModel.updateOne(
                { user_id: convertObjectId(user_id) },
                { $pull: { refreshTokenUsed: refreshToken }, $set: { refreshToken: null } }
            );
        } catch (error) {
            throw error;
        }
    };

}

module.exports = TokenService;