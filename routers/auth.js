const router = require("express").Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/auth");

const User = require("../models/User");

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
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ success: false, message: "enter empty" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "username incorrect" });
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res
        .status(400)
        .json({ succes: false, message: "password incorrect" });
    }
    const accessToken = jwt.sign(
      { userId: user._id },
      'dfsjdh tdhasjh cvmcnvc'
    );
    res.json({ success: true, accessToken });
  } catch (error) {
    res.status(500).json({ success: false, message: error });
  }
});

module.exports = router;
