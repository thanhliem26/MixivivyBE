const tourModel = require("../tour.model");

const findTourById = async (id) => {
  try {
    return await tourModel.findOne({
      _id: id,
      deleted_at: null,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findTourByName = async (name) => {
  try {
    return await tourModel.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      deleted_at: null,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteTourById = async (id) => {
  try {
    return await tourModel.findOneAndUpdate(
      {
        _id: id,
      },
      { deleted_at: new Date() }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  findTourById,
  findTourByName,
  deleteTourById,
};
