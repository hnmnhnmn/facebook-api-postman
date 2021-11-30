const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token not found" });
  }
  try {
    const decode = jwt.verify(token,'dfsjdh tdhasjh cvmcnvc');
    req.userId = decode.userId;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ success: false, message: error });
  }
};

const isAdmin = (req, res, next) => {
  const authHeader = req.header("Authorization");

  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token not found" });
  }
  if(req.admin){
    try {
      const decode = jwt.verify(token,'dfsjdh tdhasjh cvmcnvc');
      req.admin = decode.admin;
      next();
    } catch (error) {
      console.log(error);
      return res.status(403).json({ success: false, message: error });
    }
  }else {
    return res.status(403).json({ success: false, message: error.toString() });
  }
  
}; 
module.exports = isAdmin;
module.exports = verifyToken;
