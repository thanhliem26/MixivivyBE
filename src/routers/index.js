'use strict'

const express = require('express');
const router = express.Router();

//router handle
router.use('/v1/api/access', require('./access'));
router.use('/v1/api/booking', require('./booking'));
router.use('/v1/api/blog', require('./blog'));
router.use('/v1/api/user', require('./user'));
router.use('/v1/api/tours', require('./tours'));
router.use('/v1/api/bank', require('./bank'));
router.use('/v1/api/accountBank', require('./accountBank'));

router.get('/', (req, res, next) => {
    return res.status(200).json({
        message: 'Hello word',
    })
})

module.exports = router;