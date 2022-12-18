const router = require("express").Router();
const bcrypt = require("bcrypt");
const { rawListeners, findById } = require("../models/User");
const User = require("../models/User");

router.get("/", (req,res) =>{
    res.send("Users Page")
})

//update user
router.patch("/:id", async (req, res) =>{
    if(req.body.userId === req.body.params || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.params.password, salt);
            }catch (error){
                return res.status(500).json(error)
            }
        }
        try{
            const user = await User.updateOne({_id :req.params.id}, {$set:req.body});
            res.status(200).json(user);
        }catch (error){
            return res.status(500).json(error);
        }
    }
})

//delete  user
router.delete("/:id", async (req, res) =>{
    if(req.body.userId === req.body.params || req.body.isAdmin){
        try{
            const user = await User.deleteOne({_id :req.params.id});
            res.status(200).json("Account has been deleted");
        }catch (error){
            return res.status(403).json(error);
        }
    }
})

//get a user
router.get("/:id", async (req, res) =>{
    try{
        const user = await User.findById(req.params.id);
        const {password,updatedAt, ...other} = user._doc; //other = the things to be shown (password and updatedAt will be discarded)
        res.status(200).json(other);
    }catch (error){
        return res.status(500).json(error);
    }
})

//follow user
//TODO: Update problem while following
router.patch("/follow/:id", async (req, res) =>{
    if(req.params.id != req.body._id){
        try{
            //get user id
            const user = await User.findOne({_id: req.params.id});
            const currentUser = await findById({_id:req.body._id});

            //check if current user is not following the requested user already
            if(!user.followers.includes(req.body._id)){
                await user.updateOne({$push:{followers:req.body._id}}),
                await currentUser.updateOne({$push:{followings:req.params.id}});
                res.status(200).json("You are following now");
            }else{
            res.status(403).json("You are already following this user");
                }
        }
        catch (error){
            res.status(403).json("error");
        }
    }else{
        res.status(403).json("You cannot follow yourself");
    }
})

//unfollow user
module.exports = router;