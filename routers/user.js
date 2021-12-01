const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");
const isAdmin = require("../middleware/auth");
const verifyAdmin = require('../middleware/auth')
const User = require("../models/User");

//update user
router.patch("/", verifyAdmin, async (req, res) => {
  try {
    const userUpdate = await User.findOneAndUpdate(
      { _id: req.userId },
      req.body,
      {
        new: true,
      }
    );
    res.json({ success: true, userUpdate });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});
//update user by admin
router.patch("/updateuser/:id",isAdmin, async (req,res) => {
  try {
    const userUpdate = await User.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      {
        new: true,
      }
    );
    res.json({ success: true, userUpdate });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

//get profile
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "not found user" });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});
// get profile by username
router.get("/getbyname/:name",verifyToken, async (req, res) => {
  try{
    const user = await User.findOne({username: req.params.name}).select("-password");
    if(!user) {
      return res.status(400).json({success:false, message:"not found user"});
    }
    console.log(user);
    res.json({success:true , user});
  }catch(error){
    res.status(500).json({success:true , message: error.toString()});
  }
 
})
//get all user
router.get("/",verifyAdmin, async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(400).json({ success: false, message: "not found" });
    }
    res.json({ success: true, users });
  } catch (error) {
    res.status(500).json({ success: true, message: error.toString() });
  }
});

// create a user
router.post("/createuser", async (req, res) => {
    const {username, email, password, birthday,gender,admin} =req.body;
    if (!username || !password  || !email) {
      return res.status(400).json({ succes: false, message: "enter empty" });
    }
    try {
      const userByUsername = await User.findOne({ username });
      const userByEmail = await User.findOne({ email });
    
      if (userByUsername) {
        return res.status(200).json({ succes: false, message: "user is exist" });
      }
      if (userByEmail) {
        return res.status(200).json({ succes: false, message: "email is exist" });
      }
      //all good
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({ username, email, password: hashedPassword, birthday,gender,admin });
      await newUser.save();

      //return token
      const accessToken = jwt.sign(
        { userId: newUser._id },
        'dfsjdh tdhasjh cvmcnvc'
      );
    res.json({ success: true, accessToken });
    }catch(error) {

    }
})

router.post("/signup", async (req, res) => {
  const { username, email, password, password_confirm } = req.body;
  if (!username || !password || !password_confirm || !email) {
    return res.status(400).json({ succes: false, message: "enter empty" });
  }

  if (password !== password_confirm) {
    return res
      .status(400)
      .json({ succes: false, message: "password confirm incorrect" });
  }
  try {
    const userByUsername = await User.findOne({ username });
    const userByEmail = await User.findOne({ email });
    
    if (userByUsername) {
      return res.status(200).json({ succes: false, message: "user is exist" });
    }
    if (userByEmail) {
      return res.status(200).json({ succes: false, message: "email is exist" });
    }
    //all good
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    //return token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      'dfsjdh tdhasjh cvmcnvc'
    );
    res.json({ success: true, accessToken });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});


//follow and unfollow a user
router.put("/:id/follow", verifyToken, async (req, res) => {
  try {
    const currentUser = await User.findById(req.userId);
    const friend = await User.findById(req.params.id);
    if (!friend) {
      res.status(400).json({ success: false, message: "user not found" });
    }
    console.log(currentUser.followings);
    if (!currentUser.followings.includes(req.params.id)) {
      await currentUser.updateOne(
        { $push: { followings: req.params.id } },
        { new: true }
      );
      await friend.updateOne(
        { $push: { followers: req.userId } },
        { new: true }
      );
    } else {
      await currentUser.updateOne(
        { $pull: { followings: req.params.id } },
        { new: true }
      );
      await friend.updateOne(
        { $pull: { followers: req.userId } },
        { new: true }
      );
    }
    const newUser = await User.findById(req.userId);
    res.json({ success: true, newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

module.exports = router;
