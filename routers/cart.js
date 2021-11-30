const router = require("express").Router();
const Cart = require("../models/Cart");
const User = require("../models/User");
const verifyToken = require("../middleware/auth");

router.post("/", async (req, res) => {
    try {
      const cart = new Cart({ ...req.body });
      await cart.save();
      res.json({ success: true, cart });
    } catch (error) {
      res.status(500).json({ success: false, message: error.toString() });
    }
  });

module.exports = router;