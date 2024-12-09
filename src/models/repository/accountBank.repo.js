const AccountModel = require("../accountBank.model");

const findAccountBankById = async (id) => {
  try {
    return await AccountModel.findOne({
      _id: id,
      deleted_at: null,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const findAccountBankByOrder = async (order) => {
  try {
    return await AccountModel.findOne({
      order: order,
      deleted_at: null,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const checkExitsAccountBankOrder = async (id, order) => {
  try {
    return await AccountModel.findOne({
      _id: { $ne: id },
      order: order,
      deleted_at: null,
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

const deleteAccountBankById = async (id) => {
  try {
    return await AccountModel.findOneAndUpdate(
      {
        _id: id,
      },
      { deleted_at: new Date() }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

async function findLowestOrderActiveAccount() {
  try {
   return await AccountModel.findOne({ is_active: true, deleted_at: null }) 
      .sort({ order: 1 }) 
      .populate({
        path: "bank_id",
        model: "Bank",
      })
      .exec(); 
  } catch (error) {
    throw error;
  }
}

module.exports = {
    findAccountBankByOrder,
    checkExitsAccountBankOrder,
    deleteAccountBankById,
    findAccountBankById,
    findLowestOrderActiveAccount
};
