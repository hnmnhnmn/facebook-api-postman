const router = require("express").Router();
const Product = require("../models/Product");
const User = require("../models/User");
const verifyToken = require("../middleware/auth");

//create a product
router.post("/", async (req, res) => {
  try {
    const product = new Product({ ...req.body });
    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

//update product
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const productUpdate = await Product.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true }
    );
    if (!productUpdate) {
      return res
        .status(400)
        .json({ success: false, message: "product not found" });
    }
    res.json({ success: true, post: productUpdate });
  } catch (error) {
    res.json({ success: false, message: error });
  }
});

//delete product
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const productDelete = await Product.findOneAndDelete({
      _id: req.params.id
    });

    if (!productDelete) {
      return res
        .status(400)
        .json({ success: false, message: "product not found" });
    }
    res.json({ success: true, post: productDelete });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

//get a product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id });
    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "not found product" });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: error.toString() });
  }
});

//get all products
router.get("/", async (req,res) => {
  try{
    const products = await Product.find({});
    res.json({success: true, products});
  }catch(error){
    res.json({success: false, message:error.toString()});
  }
})

//get a product
router.get("/getProductByBrand/:brand", async (req, res) => {
  try {
    console.log(req.params.brand);
    const product = await Product.find({ brandName: req.params.brand });
    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "not found product" });
    }
    console.log(product);
    res.json({ success: true, product });
  } catch (error) {
    res.json({ success: false, message: error.toString() });
  }
});

// //like and dislike
// router.put("/:id/like", verifyToken, async (req, res) => {
//   try {
//     let post = await Post.findOne({ _id: req.params.id });
//     if (!post) {
//       return res
//         .status(400)
//         .json({ success: false, message: "not found post" });
//     } else {
//       if (!post.likes.includes(req.userId)) {
//         await post.updateOne({ $push: { likes: req.userId } }, { new: true });
//       } else {
//         await post.updateOne({ $pull: { likes: req.userId } }, { new: true });
//       }
//       let newPost = await Post.findOne({ _id: req.params.id });
//       res.json({ success: true, post: newPost });
//     }
//   } catch (error) {
//     res.status(500).json({ success: false, message: error });
//   }
// });

// //get list post user and friend of user
// router.get("/listPost/all", verifyToken, async (req, res) => {
//   try {
//     const currentUser = await User.findById(req.userId);
//     const currentUserPost = await Post.find({ userId: req.userId });

//     const friendPost =
//       (await Promise.all(
//         currentUser.followings.map((friendId) =>
//           Post.find({ userId: friendId })
//         )
//       )) || [];
//     res.json({ success: true, listPost: [...currentUserPost, ...friendPost] });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error });
//   }
// });

module.exports = router;
