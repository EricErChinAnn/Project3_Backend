const express = require('express')
const router = express.Router();
const { Product, Image } = require('../../models/index')

const productDataLayer = require('../../dal/product')


//Get all products
router.get('/', async(req,res)=>{
    res.send(await productDataLayer.getAllProductsWithRelated())
})




module.exports = router;