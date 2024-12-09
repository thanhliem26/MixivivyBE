  "use strict";

  const mongoose = require("mongoose"); // Erase if already required

  const DOCUMENT_NAME = "AccountBank";
  const COLLECTION_NAME = "AccountBanks";
  // Declare the Schema of the Mongo model
  var accountBankSchema = new mongoose.Schema(
    {
      name: {
        type: String,
        default: null,
        required: true,
      },
      bank_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Bank',
        required: true,
        index: true,
      },
      bank_account_number: {
        type: String,
        required: true,
      },
      is_active: {
        type: Boolean,
        required: true,
        default: true,
      },
      order: {
        type: Number,
        required: true,
      },
      created_at: {
        type: Date,
        default: Date.now,
      },
      updated_at: {
        type: Date,
        default: Date.now,
      },
      deleted_at: {
        type: Date,
        default: null,
      },
    },
    {
      timestamps: false,
      collection: COLLECTION_NAME,
    }
  );

  //Export the model
  module.exports = mongoose.model(DOCUMENT_NAME, accountBankSchema);
