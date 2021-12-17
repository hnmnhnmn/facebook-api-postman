const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema(
    {
        userId: {
        type: String,
       
      },
    },
    { timestamps: true },
    {collection:'room'}
  );
  
  module.exports = mongoose.model("room", RoomSchema);