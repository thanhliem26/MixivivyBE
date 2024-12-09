const { Types } = require('mongoose')

const convertObjectId = (id) => {
    return new Types.ObjectId(id)
}

module.exports = convertObjectId;
