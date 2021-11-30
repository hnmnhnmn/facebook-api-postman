const mongoose = require("mongoose");

const UserDUTSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      min: 3,
      max: 20,
      unique: true,
    },
    password: {
      type: String,
      require: true,
      min: 6,
      max: 50,
    },
    email: {
      type: String,
      unique: true,
    },
    phone: {
      type: Number,
      unique: true,
    },
  },
  { timestamps: true },
  {collection:'userdut'}
);

module.exports = mongoose.model("userdut", UserDUTSchema);
