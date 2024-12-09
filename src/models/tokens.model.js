const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Token";
const COLLECTION_NAME = "Tokens";
// Declare the Schema of the Mongo model
var tokenSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      require: true,
    },
    refreshTokenUsed: {
      type: Array,
      default: [],
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
    collection: COLLECTION_NAME,
    timestamps: false,
  }
);

//Export the model
module.exports = model(DOCUMENT_NAME, tokenSchema);
