
const verifyToken = require("../middleware/auth");
const jwt = require("jsonwebtoken");

const router = require("express").Router();
const User = require("../models/User");
const Room = require("../models/room");
const WaitingRoom = require("../models/waitingroom");

// const room = [];

console.log("----------room----------");

function checkAnyoneAvailable(){

}




router.post("/available",verifyToken, async (req, res) =>{
    const user = await User.findById(req.userId);
    console.log(user);
    if(!user) {
        return res.status(400).json({status: 400, message:"User not found"});
    }
    // const userId =user._id;
    const newRoom = new WaitingRoom({
        userID:user._id,
        gender:user.gender
      });
      await newRoom.save();


    
    return res.json({newRoom});    
});
function createRoom (user1,user2) {
    return user1._id + user2._id ;
}
function checkPotentialPartner (user1, user2){

}
router.get("/checkroom", verifyToken, async (req,res) => {
    
    try{
        const userCount = await WaitingRoom.count('_id');
        if(userCount>=2){
            const female = await WaitingRoom.findOne({gender:"female"});
            if(!female){
                return res.json({success:"false",message:"not found female"});
            }
            const male = await WaitingRoom.findOne({gender:"male"});
            // const users = await WaitingRoom.find({});
            // const link = createRoom(users[0],users[1]);
            const link = createRoom(male,female);
            male.remove();
            female.remove();
            return res.json({link});
        }
    }catch(error){
        return res.status(500).json({measage:error.toString()});
    }
});
router.get("/matching",verifyToken, async (req, res) => {
  
});

module.exports = router;