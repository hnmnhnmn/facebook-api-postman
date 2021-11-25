const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    categorical: {
      type: String,
    },
    price: {
      type: Number,
    },
    priceDiscount: {
      type: Number,
    },
    rating: {
      type: Number,
    },
    quantity: {
      type: Number,
    },
    description: {
      type: String,
    },
    brandName: {
      type: String,
    },
    ProductImage: {
      type: String,
    },
    createBy: {
      type: String,
    },
    thumbnail: {
      type: String,
    },
    images: {
      type: Array,
    },
    colors: {
      type: Array,
    },
    createAt: {
      type: String,
    },
    updateAt: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", ProductSchema);
