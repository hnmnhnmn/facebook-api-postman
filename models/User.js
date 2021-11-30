const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
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
    profilePicture: {
      type: String,
      default: "",
    },
    birthday: {
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
    address: {
      type: String,
      default: "",
    },
    followers: {
      type: Array,
      default: [],
    },
    followings: {
      type: Array,
      default: [],
    },
    bio: {
      type: String,
      default: "",
    },
    admin:{
      type: Boolean,
      default: false
    },
    relationship: {
      type: Number,
      enum: [1, 2, 3],
    },
  },
  { timestamps: true },
  {collection:'user'}
);

module.exports = mongoose.model("user", UserSchema);
