const blogsModel = require("../blogs.model");

const findBlogById = async (id) => {
  try {
    return await blogsModel.findOne({
      _id: id,
      deleted_at: null,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const checkExitsBlogName = async (id, name) => {
  try {
    return await blogsModel.findOne({
      _id: { $ne: id },
      name: { $regex: new RegExp(`^${name}$`, "i") },
      deleted_at: null,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findByName = async (name) => {
  try {
    return await blogsModel.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      deleted_at: null,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteBlogById = async (id) => {
  try {
    return await blogsModel.findOneAndUpdate(
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
  findBlogById,
  checkExitsBlogName,
  findByName,
  deleteBlogById,
};
