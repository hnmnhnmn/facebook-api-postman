const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    coin: {
      type: Number,
      default: 20,
    },
    deviceId: {
      type: String,
      unique: true  
    },
    phone: {
      type: String,
      unique: true
    },
    username: {
      type: String,
      default: "",
    },
    password: {
      type:String,
    },
    email: {
      type:String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    bio: {
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
    birthday: {
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
  {collection:'user'}
);

module.exports = mongoose.model("user", UserSchema);
