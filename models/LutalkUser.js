const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
      coin: {
        type: Number,
        default: 0,
      },
      deviceId: {
        type: String,
      },
      phone: {
        type: String,
        default: "",
      },
      password: {
        type:String,
      },
      date: {
        type: String,
        default: "",
      },
      gender: {
        type: String,
        default: "",
      },
      avatar: {
        type: String,
        default: "",
      },
      url_video: {
        type: String,
        default: "",
      },
      followings: {
        type: Array,
        default: [],
      },
      followers: {
        type: Array,
        default: [],
      },
    },
    { timestamps: true },
    {collection:'LutalkUser'}
  );
  
  module.exports = mongoose.model("LutalkUser", UserSchema);
  