const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const CartItemSchema = new mongoose.Schema(
  {
    product: { type: ObjectId, ref: "Product" },
    name: String,
    price: Number,
    count: Number
  },
  { timestamps: true }
);

const CartItem = mongoose.model("CartItem", CartItemSchema);

const CartSchema = new mongoose.Schema(
  {
    products: [CartItemSchema],
    user: { type: ObjectId, ref: "User" }
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", CartSchema);

module.exports = { Cart, CartItem };