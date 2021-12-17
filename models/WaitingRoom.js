const mongoose = require("mongoose");

const WaitingRoomSchema = new mongoose.Schema(
    {
        userId: {
        type: String,
      },
        gender: {
        type: String,
      },
    },
    { timestamps: true },
    {collection:'waitingroom'}
  );
  
  module.exports = mongoose.model("waitingroom", WaitingRoomSchema,"waitingroom");