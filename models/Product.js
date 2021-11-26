const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    categorical: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      default: 0,
    },
    priceDiscount: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      default: "",
    },
    brandName: {
      type: String,
      default: "",
    },
    ProductImage: {
      type: String,
      default: "",
    },
    createBy: {
      type: String,
      default: "",
    },
    thumbnail: {
      type: String,
      default: "",
    },
    images: {
      type: Array,
      default: [],
    },
    colors: {
      type: Array,
      default: [],
    },
    createAt: {
      type: String,
      default: "",
    },
    updateAt: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("products", ProductSchema);
