// Every time the user logs in we need to create a refresh token so we need it
// Then the particular user will log out we have to delete that refresh token also from the database

import mongoose from "mongoose";

const refreshTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);
// The line refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); in your Mongoose schema is used to create a TTL (Time-To-Live) index on the expiresAt field of the RefreshToken collection in MongoDB.
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });//expireAfterSeconds: 0 means delete exactly when the expiresAt time comes.

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
export default RefreshToken;