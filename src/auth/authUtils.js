'use strict';
const JWT = require('jsonwebtoken');
const asyncHandler = require('../helper/asyncHandler');
const { HEADER, ROLE_APPLICATION } = require("../utils/constant");
const { AuthFailureError, NotFoundError, ForbiddenError } = require('../core/error.response');
const { findByUserId } = require('../services/token.service');

const createTokenPair = async ({payload, publicKey, privateKey}) => {
    try {
        //accessToken 
        const accessToken = await JWT.sign(payload, publicKey, {
           expiresIn: '2 days'
        });

        const refreshToken = await JWT.sign(payload, privateKey, {
            expiresIn: '3 days'
        });

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if(err) {
                console.log("error verify token")
            } else {
                console.log("decode verify: ", decode)
            }
        })

        return { accessToken, refreshToken };
    } catch(error) {
        throw error;
    }
}

const authentication = asyncHandler(async (req, res, next) => {
    /** 
     * 1 - check user_id missing
     * 2 - get accessToken
     * 3 - verify Token
     * 4 - check user in bds
     * 5 - check keyStore with this userId
     * 6 - return next
    */
    //1.
    const user_id = req.headers[HEADER.CLIENT_ID];
    if(!user_id) throw new AuthFailureError('Invalid Request!');

    //2.
    const keyStore = await findByUserId(user_id);
    if(!keyStore) throw new NotFoundError('keyStore not found');

    //3.
    const bearerToken = req.headers[HEADER.AUTHORIZATION];
    const accessToken = bearerToken.split(' ')[1];

    if(!accessToken) throw new AuthFailureError("Invalid Request");

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if(user_id !== decodeUser.user_id) throw new AuthFailureError('Invalid user_id');

        req.keyStore = keyStore;
        return next();
    } catch(error) {
        throw error
    }
})

const authenticationV2 = asyncHandler(async (req, res, next) => {
    /** 
     * 1 - check user_id missing
     * 2 - get accessToken
     * 3 - verify Token
     * 4 - check user in bds
     * 5 - check keyStore with this userId
     * 6 - return next
    */

    //1.
    const user_id = req.headers[HEADER.CLIENT_ID];
    if(!user_id) throw new AuthFailureError('Invalid Request!');

    //2.
    const keyStore = await findByUserId(user_id);
    if(!keyStore) throw new NotFoundError('keyStore not found');

    //3.
    if(req.headers[HEADER.REFRESH_TOKEN]) {
        try {
            const refreshToken = req.headers[HEADER.REFRESH_TOKEN];
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
            if(user_id !== decodeUser.user_id) throw new AuthFailureError('Invalid user_id');
    
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            return next();
        } catch(error) {
            throw error
        }
    }

    const bearerToken = req.headers[HEADER.AUTHORIZATION];
    const accessToken = bearerToken.split(' ')[1];

    if(!accessToken) throw new AuthFailureError("Invalid Request");

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if(user_id !== decodeUser.user_id) throw new AuthFailureError('Invalid user_id');

        req.keyStore = keyStore;
        req.user = decodeUser;
        return next();
    } catch(error) {
        throw error
    }
})

const isAdmin = asyncHandler(async (req, res, next) => {
    const user_id = req.headers[HEADER.CLIENT_ID];
    if(!user_id) throw new AuthFailureError('Invalid Request!');

    //2.
    const keyStore = await findByUserId(user_id);
    if(!keyStore) throw new NotFoundError('keyStore not found');

    //3.
    const bearerToken = req.headers[HEADER.AUTHORIZATION];
    const accessToken = bearerToken.split(' ')[1];

    if(!accessToken) throw new AuthFailureError("Invalid Request");
  
    try {
      const decodeUser = await JWT.verify(accessToken, keyStore.publicKey);
      if(decodeUser.role_user === ROLE_APPLICATION.ADMIN) {
        return next();
      } 
      
      throw new ForbiddenError("You don't have permission!")
      
    } catch (error) {
      throw error;
    }
  });
  

const verifyJWT = async (token, keySecret) => {
    return await JWT.verify(token, keySecret)
}

module.exports = {
    createTokenPair,
    authentication,
    verifyJWT,
    authenticationV2,
    isAdmin
}