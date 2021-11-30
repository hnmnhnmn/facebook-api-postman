const router = require("express").Router();
const Cart = require("../models/Cart");
const User = require("../models/User");
const verifyToken = require("../middleware/auth");

//add a cart
router.post("/", verifyToken, async (req, res) => {
  try {
    const cart = new Cart({ userId: req.userId, ...req.body });
    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    res.status(500).json({ success: false, message: error.toString() });
  }
});
//get a cart
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const cart = await Cart.findOne({ _id: req.params.id, userId: req.userId });
    if (!cart) {
      return res
        .status(400)
        .json({ success: false, message: "not found post" });
    }
    res.json({ success: true, cart });
  } catch (error) {
    res.json({ success: false, message: error });
  }
});
//delete cart
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const cartDelete = await Cart.findOneAndDelete({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!cartDelete) {
      return res
        .status(400)
        .json({ success: false, message: "cart not found" });
    }
    res.json({ success: true, cart: cartDelete });
  } catch (error) {
    res.status(500).json({ success: false, message: error.toString() });
  }
});

//update cart
router.patch("/update/:id", verifyToken, async (req, res) => {
  try {
    const cartUpdate = await Cart.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      req.body,
      { new: true }
    );
    if (!cartUpdate) {
      return res
        .status(400)
        .json({ success: false, message: "cart not found" });
    }
    res.json({ success: true, cart: cartUpdate });
  } catch (error) {
    res.json({ success: false, message: error });
  }
});
module.exports = router;
