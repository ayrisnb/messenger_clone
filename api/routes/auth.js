const router = require("express").Router();
const bcrypt = require("bcrypt");
const User =  require("../models/User");

//REGISTER USER
router.post("/register",  async (req,res) =>{
    try {
        //hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        //create user
        const newUser =  await new User({
        username:  req.body.username,
        email:req.body.email,
        password:hashedPassword
         });

         //save user
        const user = await newUser.save();
        return res.send(user);

    } catch (error) {
        console.log(error);
    }
})

//LOGIN
router.post("/login", async (req, res) =>{
    try {
        //if user not registered
        const user = await User.findOne({email:req.body.email});
        !user && res.status(404).json("User not found");

        //if wrong password entered
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        !validPassword && res.status(400).json("Invalid password");

      //if everything ok
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json(error);
    }
})


module.exports = router;