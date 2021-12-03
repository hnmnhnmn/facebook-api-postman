const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken =require ('../middleware/auth');
// const isAdmin = require("../middleware/auth").isAdmin;
const verifyAdmin = require("../middleware/authAdmin");
const User = require("../models/LutalkUser");

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
    
    //password must contain a lowercase letter
    var lowerCaseLetters = /[a-z]/g;
    if(!password.match(lowerCaseLetters)){
      return res.status(400).json({success:false , message: "password must contain a lowercase letter"});
    }
    // //password must contain a Uppercase letter
    // var upperCaseLetters = /[A-Z]/g;
    // if(!password.match(upperCaseLetters)){
    //   return res.status(400).json({success:false , message: "password must contain a Uppercase letter"});
    // }
    //password must contain a number
    var numbers = /[0-9]/g;
    if(!password.match(numbers)){
      return res.status(400).json({success:false , message: "password must contain a number"});
    }
    // password minimum 6 characters
    if(password.length <6 ){
      return res.status(400).json({success:false , message: "minimum password 6 characters"});
    }
    // password maximum 30 characters
    if(password.length >30 ){
      return res.status(400).json({success:false , message: "maximum password 30 characters"});
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
      console.log("success");
      res.status(200).json({ token:accessToken["accessToken"] });
    } catch (error) {
      console.log("fail");
      res.status(500).json({ success: false, message: error });
    }
  });
  
  //login user
  /*
  Đăng nhập  
  Đọc email, password từ req.body
  Nếu hoặc email hoặc password rỗng thì trả về status 400 message "enter empty"
  Tìm kiếm và trả về bằng try catch
  try
    gắn user = user tìm được bằng email User.findOne({email})
    Nếu user không tồn tại thì trả về 400 message "email incorrect"
    gắn passwordValid = await bcrypt.compare(password,user.password)
    Nếu passwordValid sai thì trả về 400 và message"password incorrect"
    Tiếp theo là tạo token ( với thông tin là userId và đoạn mã ACCESS_TOKEN_SECRET) trả về res.json. 
      const accessToken = jwt.sign(
        { userId: newUser._id },
        process.env.ACCESS_TOKEN_SECRET
      );
    res.json({ success: true, accessToken });
  catch trả về res 200 json { success: false, message: error }. res.status(500).json({ success: false, message: error });
  
  */
  router.post("/signin", async (req, res) => {
    const { username, password, admin } = req.body;
  
    console.log(req.body);
    console.log(password);
    console.log(admin);
  
    if (!username || !password) {
      return res.status(400).json({status: 400, message: "enter empty" });
    }
    try {
      
      const user = await User.findOne({ username });
      if (!user) {
        return res
          .status(400)
          .json({ status: 400, message: "username incorrect" });
      }
      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        return res
          .status(400)
          .json({ status: 400, message: "password incorrect" });
      }
      const accessToken = jwt.sign(
        { userId: user._id, admin: user.admin },
        'dfsjdh tdhasjh cvmcnvc'
      );
      console.log("success");
      res.json({status: 200, message:"Login Success",accessToken });
    } catch (error) {
      console.log("fail");
      res.status(500).json({ status: 400, message: error.toString() });
    }
  });
  router.post("/gettest", (req,res) => {
    const token = req.body;
    res.json(token);
    console.log(token);
  })
  module.exports = router;
  