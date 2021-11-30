const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CartSchema = new mongoose.Schema(
    {
        listItem: {
            type: Array,
            default: [],
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "userdut",
        }
    }
)
const CartItemSchema = new mongoose.Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "products",
        },
        numOfItem:{
            type: Number,
            default: 0,
        }
    }
)
module.exports = mongoose.model("carts", CartSchema);
