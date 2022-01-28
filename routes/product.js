const cryptoJs = require("crypto-js");
const Product = require("../models/Product");
const { VerifyTokenAndAuth, VerifyTokenAndAdmin, VerifyToken } = require("./VerifyToken")

const router = require("express").Router()

// CREATE 
router.post("/",VerifyTokenAndAuth, async(req, res) => {
    const newProduct = new Product(req.body)
    try {
        const savedProduct = await newProduct.save()
        res.status(200).json(savedProduct)
    } catch (err) {
        res.status(500).json(err)
    }
})



// req.query UPDATE  PRODUCT
router.put("/:id",VerifyTokenAndAdmin, async(req, res) => {
    
    try{
        const updatedProduct = await Product.findByIdAndUpdate(
          req.params.id,
            {
              $set: req.body,
            },
              {new : true}
        )
        res.status(200).send(updatedProduct)
    }catch(err){res.status(500).json(err)}
})


// DELETE PRODUCT
router.delete("/:id", VerifyTokenAndAdmin, async (req, res) => {
    try {
       await Product.findByIdAndDelete(req.params.id)
       res.status(200).json("Product has been deleted !")
    } catch (err) {
        res.status(500).json(err)
    }
})


// GET PRODUCT
router.get("/find/:id", VerifyTokenAndAuth, async (req, res) => {
    try {
       const product = await Product.findById(req.params.id)
        
       res.status(200).json(product)
    } catch (err) {
        res.status(500).json(err)
    }
})


// GET ALL PRODUCTS
router.get("/", VerifyTokenAndAuth,async (req, res) => {
    const qNew = req.query.new
    const qCategory = req.query.category

    try {
        let products;
        
        if(qNew){
            products = await Product.find().sort({ createdAt: -1}).limit(5)
        } else if (qCategory) {
            products = await Product.find({
                categories: {
                    $in: [qCategory],
                },
            })
        } else {
            products = await Product.find()
        }

       res.status(200).json(products)
    } catch (err) {
        res.status(500).json(err.message)
    }
})


module.exports = router