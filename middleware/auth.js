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
    const decode = jwt.verify(token, "dfsjdh tdhasjh cvmcnvc");
    req.userId = decode.userId;
    req.admin = decode.admin;
    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ success: false, message: error });
  }
};

// const isAdmin = (req, res, next) => {
//   const authHeader = req.header("Authorization");
<<<<<<< HEAD

//   const token = authHeader && authHeader.split(" ")[1];
//   if (!token) {
//     return res
//       .status(401)
//       .json({ success: false, message: "Access token not found" });
//   }
//   if (req.admin) {
//     try {
//       const decode = jwt.verify(token, "dfsjdh tdhasjh cvmcnvc");
//       req.admin = decode.admin;
//       next();
//     } catch (error) {
//       console.log(error);
//       return res.status(403).json({ success: false, message: error });
//     }
//   } else {
//     return res.status(403).json({ success: false, message: error.toString() });
//   }
// };

 
// exports.isAdmin = [verifyToken,verifyAdmin];
// const verifyAdmin = function () {
//   return function (req, res, next) {
//     verifyToken(req, res, function () {
//       if (req.admin) {
//         next();
//       } else {
//         return res.status(403).send({
//           success: false,
//           message:
//             "Token valid, but you don't have the right permission to access this resource :)",
//         });
//       }
//     });
//   };
// };

module.exports = verifyToken;
// module.exports = [isAdmin];
// module.exporsts = [verifyToken];
// module.exports = [verifyAdmin];
// module.exports = [verifyToken];
// module.exports = [verifyAdmin];
=======

//   const token = authHeader && authHeader.split(" ")[1];
//   if (!token) {
//     return res
//       .status(401)
//       .json({ success: false, message: "Access token not found" });
//   }
//   if(req.admin){
//     try {
//       const decode = jwt.verify(token,'dfsjdh tdhasjh cvmcnvc');
//       req.admin = decode.admin;
//       next();
//     } catch (error) {
//       console.log(error);
//       return res.status(403).json({ success: false, message: error });
//     }
//   }else {
//     return res.status(403).json({ success: false, message: error.toString() });
//   }
  
// }; 
const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log(req.admin)
    if (req.admin) {
      next();
    } else {
      res.status(400).json("not allowed( you are not admin");
    }
  });
};
// module.exports = verifyAdmin;;
// module.exports = isAdmin;
module.exports =verifyToken;
// module.exports =verifyAdmin;
>>>>>>> 4a565bfb213e236fb12f78220da45a4928acc472
