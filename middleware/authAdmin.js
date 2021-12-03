const verifyToken = require('./auth');
const verifyAdmin =  (req, res, next) => {
    verifyToken(req, res, () => {
    console.log(req.admin)
    if (req.admin) {
      next();
    } else {
      res.status(400).json("not allowed (you are not admin)");
    }
  });
};

module.exports = verifyAdmin;
