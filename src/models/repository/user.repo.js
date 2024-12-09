const Joi = require("joi");
const userModel = require("../user.model");

const validateUser = async (payload) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    password: Joi.string()
      .pattern(
        new RegExp("^[a-zA-Z0-9!@#$%^&*()_+\\-=\\[\\]{};':\",.<>?]{3,30}$")
      )
      .required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
  }).unknown(true);

  try {
    const value = await schema.validateAsync({ ...payload });
    if (value) return { status: true };
  } catch (error) {
    return {
      status: false,
      message: error.details?.[0]?.message,
    };
  }
};

const findById = async (id) => {
  try {
    return await userModel.findOne(
      {
        _id: id,
        deleted_at: null,
      },
      "-password"
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteUserById = async (id) => {
  try {
    return await userModel.findOneAndUpdate(
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
  findById,
  validateUser,
  deleteUserById
};
