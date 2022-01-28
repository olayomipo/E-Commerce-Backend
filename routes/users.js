const cryptoJs = require("crypto-js");
const User = require("../models/User");
const { VerifyTokenAndAuth, VerifyTokenAndAdmin } = require("./VerifyToken")

const router = require("express").Router()


// req.query UPDATE  
router.put("/:id",VerifyTokenAndAuth, async(req, res) => {
    if(req.body.password) {
        req.body.password= cryptoJs.AES.encrypt(
            req.body.password,
            process.env.AEC_KEY
        ).toString();
    }

    try{
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
            {
              $set: req.body,
            },
              {new : true}
        )
        res.status(200).send(updatedUser)
    }catch(err){res.status(500).json(err)}
})


// DELETE
router.delete("/:id", VerifyTokenAndAuth, async (req, res) => {
    try {
       await User.findByIdAndDelete(req.params.id)
       res.status(200).json("User has been deleted !")
    } catch (err) {
        res.status(500).json(err)
    }
})


// GET USER
router.get("/find/:id", VerifyTokenAndAdmin, async (req, res) => {
    try {
       const user = await User.findById(req.params.id)
       const {password, ...others} = user._doc;
        
       res.status(200).json(others)
    } catch (err) {
        res.status(500).json(err)
    }
})


// GET ALL USERS
router.get("/", VerifyTokenAndAdmin, async (req, res) => {
    const query = req.query.new
    try {
       const users = query
        ? await User.find().sort({_id: -1}).limit(5)
        : await User.find()        
       res.status(200).json(users)
    } catch (err) {
        res.status(500).json(err)
    }
})


// GET ALL USERS STATS
router.get("/stats", VerifyTokenAndAdmin , async (req, res) => {
    const date = new Date();
    const lastyear = new Date(date.setFullYear(date.getFullYear() - 1))

    try {
        const data = await User.aggregate([
            { $match: {createdAt: { $gte: lastyear } } },
            {
                $project: {
                    month: { $month: "$createdAt"},
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {$sum: 1}
                }
            }
        ])
        res.status(200).json(data)
    } catch (err) {
        res.status(500).json(err.message)
    }
})


module.exports = router