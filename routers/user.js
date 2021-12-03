const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");
// const isAdmin = require("../middleware/auth").isAdmin;
const verifyAdmin = require("../middleware/authAdmin");
const User = require("../models/User");

// const authMiddleware = require("../middleware/auth");

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

//update user
router.patch("/", verifyToken, async (req, res) => {
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
router.patch("/updateuser/:id", verifyToken, async (req, res) => {
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
router.get("/getbyname/:name", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.name }).select(
      "-password"
    );
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "not found user" });
    }
    console.log(user);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: true, message: error.toString() });
  }
});
// get profile by phone
router.get("/getbyphone/:phone", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ phone: req.params.phone }).select(
      "-password"
    );
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "not found user" });
    }
    console.log(user);
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: true, message: error.toString() });
  }
});
//get all user
router.get("/", verifyToken, async (req, res) => {
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
router.post("/createuser", verifyToken, async (req, res) => {
  const { phone, username,  password, gender } = req.body;
  if (!phone || !username || !password ) {
    return res.status(400).json({ succes: false, message: "Enter empty" });
  }

  // if (!validateEmail(email)) {
  //   return res.status(400).json({ succes: false, message: "Email invalid" });
  // }
  try {
    const userByUsername = await User.findOne({ username });
    //const userByEmail = await User.findOne({ email });
    const userByPhone = await User.findOne({ phone });

    if (userByPhone) {
      return res
        .status(200)
        .json({ succes: false, message: "This phone is already registered" });
    }
    if (userByUsername) {
      return res.status(200).json({
        succes: false,
        message: "This username is already registered",
      });
    }
    // if (userByEmail) {
    //   return res.status(200).json({ succes: false, message: "Email is exist" });
    // }
    //all good
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      gender,
    });
    await newUser.save();

    //return token
    const accessToken = jwt.sign(
      { userId: newUser._id },
      "dfsjdh tdhasjh cvmcnvc"
    );
    res.json({ success: true, accessToken });
  } catch (error) {}
});

// router.post("/signup", async (req, res) => {
//   const { username, email, password, password_confirm } = req.body;
//   if (!username || !password || !password_confirm || !email) {
//     return res.status(400).json({ succes: false, message: "enter empty" });
//   }

//   if (password !== password_confirm) {
//     return res
//       .status(400)
//       .json({ succes: false, message: "password confirm incorrect" });
//   }
//   try {
//     const userByUsername = await User.findOne({ username });
//     const userByEmail = await User.findOne({ email });

//     if (userByUsername) {
//       return res.status(200).json({ succes: false, message: "user is exist" });
//     }
//     if (userByEmail) {
//       return res.status(200).json({ succes: false, message: "email is exist" });
//     }
//     //all good
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);
//     const newUser = new User({ username, email, password: hashedPassword });
//     await newUser.save();

//     //return token
//     const accessToken = jwt.sign(
//       { userId: newUser._id },
//       "dfsjdh tdhasjh cvmcnvc"
//     );
//     res.json({ success: true, accessToken });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error });
//   }
// });

//follow and unfollow
// router.put("/follow/:id",verifyToken, async (req,res) => {
//   try{
//     const currentUser = await User.findById(req.userId);
//     const friend = await User.findById(req.params.id);
//     if(!friend) {
//       return res.status(400).json({success:false, message:"not found user to follow/unfollow"});
//     }
//     console.log(currentUser.followings);
//     if(!currentUser.followings.includes(req.params.id)){
//       await currentUser.updateOne(
//         {$push : { followings: req.params.id}},
//         {new:true}
//       );
//       await friend.updateOne(
//         {$push: { followers: req.params.id}},
//         {new: true}
//       )
//     }else{
//       await currentUser.updateOne(
//         {$pull:{followings: req.params.id }},
//         {new:true}
//       );
//       await friend.updateOne(
//         {$pull:{followers: req.params.id}},
//         {new:true}
//       );
//     }
//   }catch(error){
//     res.status(500).json({ success: false, message: error.toString() });
//   }
// });
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
//get followes by id
router.get("/:id/followers", verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    const followers = user.followers;
    if (!followers) {
      return res
        .status(400)
        .json({ success: false, message: "not found user" });
    }
    res.json({ success: true, followers });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

//get followings by id
router.get("/:id/followings", verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    const followings = user.followings;
    if (!followings) {
      return res
        .status(400)
        .json({ success: false, message: "not found user" });
    }
    res.status(200).json({ success: true, followings });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

//change password
router.post("/changepassword", verifyToken, async (req, res) => {
  const authHeader = req.header("Authorization");

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token not found" });
  }
  const decode = jwt.verify(token, "dfsjdh tdhasjh cvmcnvc");
  req.userId = decode.userId;

  const { oldpassword, newpassword, newpassword_confirm } = req.body;
  if (!oldpassword || !newpassword || !newpassword_confirm) {
    return res.status(400).json({ success: false, message: "Enter empty" });
  }
  if (oldpassword === newpassword) {
    return res
      .status(400)
      .json({
        success: false,
        message: "The new password must differ from your previous password",
      });
  }
  if (newpassword !== newpassword_confirm) {
    return res
      .status(400)
      .json({
        success: false,
        message: "The password confirmation does not match",
      });
  }
  var password = newpassword;
  //password must contain a lowercase letter
  var lowerCaseLetters = /[a-z]/g;
  if (!password.match(lowerCaseLetters)) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Password must contain a lowercase letter",
      });
  }

  //password must contain a number
  var numbers = /[0-9]/g;
  if (!password.match(numbers)) {
    return res
      .status(400)
      .json({ success: false, message: "Password must contain a number" });
  }
  // password minimum 6 characters
  if (password.length < 6) {
    return res
      .status(400)
      .json({ success: false, message: "Minimum password 6 characters" });
  }
  // password maximum 30 characters
  if (password.length > 30) {
    return res
      .status(400)
      .json({ success: false, message: "Maximum password 30 characters" });
  }
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(400).json({ status: 400, message: "User not found" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const passwordVaild = await bcrypt.compare(oldpassword, user.password);
    if (!passwordVaild) {
      return res
        .status(400)
        .json({ status: 400, message: "Password is wrong" });
    }
    const userUpdate = await User.findOneAndUpdate(
      { _id: req.userId },
      { password: hashedPassword },
      {
        new: true,
      }
    );
    res.json({ success: true, userUpdate });
  } catch (error) {
    res.status(500).json({ status: 500, message: error.toString() });
  }
});

//forget password
router.post("/forgetpassword", async (req,res) => {
  const {phone} = req.body;
  try {
    const user = await User.findOne({phone});
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "not found user" });
    }
    // decode password mới lấy được
    const password = user.password;
    // const passwordValid = await bcrypt.compare(password, user.password);

    res.json({ success: true, password: password });
  } catch (error) {
    res.status(500).json({ success: false, message: error.toString() });
  }
});


module.exports = router;
