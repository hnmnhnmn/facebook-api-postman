const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");

const User = require("../models/User");

function phonenumber(inputtxt) {
  var phoneno = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  if (inputtxt.match(phoneno)) {
    return true;
  } else {
    return false;
  }
}

//check user is login
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "user not found " });
    }
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

//register
/*
Đăng ký.
Đọc username, email, password, password_confirm từ req.body
Nếu 1 trong 4 trường đó rỗng thì trả về status 400 (lỗi client) với message "enter empty"
Nếu password khác với password_confirm thì trả về status 400 với message "password confirm incorrect"
Bắt đầu vòng try catch để kiểm tra đã có ai đăng ký với username hoặc email này chưa.
try tìm coi đã ai đăng ký với username này chưa. Nếu có trả về status 200 với message "user is exist"
    tìm coi đã ai đăng ký với email này chưa. Nếu có trả về status 200 với message "email is exist"
    Nếu mọi chuyện đã ổn thì tạo user mới này
      tạo saltround là const salt = await bcrypt.genSalt(10);
      tạo hashedPassword từ password và salt vừa tạo.   const hashedPassword = await bcrypt.hash(password, salt);
      Giờ tạo newUser bằng username, email và hashedPassword. const newUser = new User({ username, email, password: hashedPassword });
      lưu newUser lại vào database user. await newUser.save()
    Tiếp theo là tạo token ( với thông tin là userId và đoạn mã ACCESS_TOKEN_SECRET) trả về res.json. 
    const accessToken = jwt.sign(
      { userId: newUser._id },
      process.env.ACCESS_TOKEN_SECRET
    );
    res.json({ success: true, accessToken });
catch trả về res 200 json { success: false, message: error }. res.status(500).json({ success: false, message: error }); 
*/
router.post("/signup", async (req, res) => {
  const { phone, password, password_confirm, deviceId, coin } = req.body;
  if (!phone || !password || !password_confirm) {
    return res.status(400).json({ succes: false, message: "enter empty" });
  }

  if (password !== password_confirm) {
    return res
      .status(400)
      .json({ succes: false, message: "Password confirm incorrect" });
  }
  // if (gender !== "male" && gender !== "female") {
  //   return res
  //     .status(400)
  //     .json({ succes: false, message: "Gender must be male or female" });
  // }
  //password must contain a lowercase letter
  var lowerCaseLetters = /[a-z]/g;
  if (!password.match(lowerCaseLetters)) {
    return res.status(400).json({
      success: false,
      message: "Password must contain a lowercase letter",
    });
  }
  // //password must contain a Uppercase letter
  // var upperCaseLetters = /[A-Z]/g;
  // if(!password.match(upperCaseLetters)){
  //   return res.status(400).json({success:false , message: "password must contain a Uppercase letter"});
  // }
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
  if (!phonenumber(phone)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid phone number" });
  }
  try {
    const userByPhone = await User.findOne({ phone });
    //const userByUsername = await User.findOne({ username });
    const userByDeviceId = await User.findOne({ deviceId });
    // if (userByDeviceId) {
    //   return res.status(200).json({ succes: false, message: "This device is already registered with this phone number. Use another phone number please." });
    // }

    if (userByPhone) {
      return res
        .status(200)
        .json({ succes: false, message: "This phone is already registered" });
    }
    //
    if (userByDeviceId) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        phone,
        password: hashedPassword,
        deviceId,
        coin: 0,
      });
      await newUser.save();

      //return token
      const accessToken = jwt.sign(
        { userId: newUser._id },
        "dfsjdh tdhasjh cvmcnvc"
      );
      console.log("success");
      res.json({ status: 200, accessToken ,userId: newUser._id});
    } else {
      //all good
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newUser = new User({
        phone,
        password: hashedPassword,
        deviceId,
        coin,
      });
      await newUser.save();

      //return token
      const accessToken = jwt.sign(
        { userId: newUser._id },
        "dfsjdh tdhasjh cvmcnvc"
      );
      console.log("success");
      res.json({ status: 200, accessToken ,userId: newUser._id});
    }
  } catch (error) {
    console.log("fail");
    res.status(500).json({ success: false, message: error.toString() });
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
  const { phone, password, deviceId } = req.body;
  if (!phone || !password) {
    return res.status(400).json({ status: 400, message: "enter empty" });
  }
  try {
    const user = await User.findOne({ phone });
    if (!user) {
      return res
        .status(400)
        .json({ status: 400, message: "Phone or password incorrect" });
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res
        .status(400)
        .json({ status: 400, message: "Phone or password incorrect" });
    }
    const accessToken = jwt.sign(
      { userId: user._id },
      "dfsjdh tdhasjh cvmcnvc"
    );
    //console.log("success");
    res.status(200).json({status:200, accessToken ,userId: user._id});
  } catch (error) {
    console.log("fail");
    res.status(500).json({ status: 400, message: error.toString() });
  }
});
router.post("/gettest", (req, res) => {
  const token = req.body;
  res.json(token);
  console.log(token);
});
module.exports = router;
