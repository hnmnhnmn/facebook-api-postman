const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    
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
    
  },
  { timestamps: true },
  {collection:'user-simple'}
);

module.exports = mongoose.model("user-simple", UserSchema);
