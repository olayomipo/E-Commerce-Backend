const cryptoJs = require("crypto-js");
const Cart = require("../models/Cart");
const { VerifyTokenAndAuth, VerifyTokenAndAdmin, VerifyToken } = require("./VerifyToken")

const router = require("express").Router()

// CREATE 
router.post("/",VerifyToken, async(req, res) => {
    const newCart = new Cart(req.body)
    try {
        const savedCart = await newCart.save()
        res.status(200).json(savedCart)
    } catch (err) {
        res.status(500).json(err)
    }
})



// req.query UPDATE  CART
router.put("/:id",VerifyTokenAndAuth, async(req, res) => {
    
    try{
        const updatedCart = await Cart.findByIdAndUpdate(
          req.params.id,
            {
              $set: req.body,
            },
              {new : true}
        )
        res.status(200).send(updatedCart)
    }catch(err){res.status(500).json(err)}
})


// DELETE Cart
router.delete("/:id", VerifyTokenAndAuth, async (req, res) => {
    try {
       await Cart.findByIdAndDelete(req.params.id)
       res.status(200).json("Cart has been deleted !")
    } catch (err) {
        res.status(500).json(err)
    }
})


// GET USER CART
router.get("/find/:id", VerifyTokenAndAuth, async (req, res) => {
    try {
       const cart = await Cart.findOne({userId: req.params.userId})
        
       res.status(200).json(cart)
    } catch (err) {
        res.status(500).json(err)
    }
})


// GET ALL 
router.get("/",VerifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find()
        res.status(200).json(carts)
    } catch (err) {
        res.status(500).json(err)
    }
})


module.exports = router