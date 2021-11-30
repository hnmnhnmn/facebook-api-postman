const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CartSchema = new mongoose.Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "userduts",
        },
        products:{
            type: Array,
            default: [],
        },
        counts: {
            type: Array,
            default: [],
        }
    }
)

module.exports = mongoose.model("carts", CartSchema);
