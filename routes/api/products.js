const express = require('express')
const router = express.Router();
const { Product, Difficulty, Category, Designer , Mechanic } = require('../../models/index')

const {validateSearch} = require("../../middlewares")
const { searchSchema } = require("../../validations/productSearch")


//Get all products & Search
router.get('/', validateSearch(searchSchema) ,async (req, res) => {

    const allProducts = Product.collection()

    // console.log(req.query)

    if (req.query.name) {
        allProducts.where("name", "like", `%${req.query.name}%`)
    }

    if (req.query.min_cost) {
        allProducts.where('cost', '>=', req.query.min_cost)
    }

    if (req.query.max_cost) {
        allProducts.where('cost', '<=', req.query.max_cost);
    }

    if (req.query.player_min) {
        allProducts.where('player_min', '>=', req.query.player_min)
    }

    if (req.query.player_max) {
        allProducts.where('player_max', '<=', req.query.player_max);
    }

    if (req.query.avg_duration) {
        allProducts.where('avg_duration', '<=', req.query.avg_duration);
    }

    if (req.query.min_age) {
        allProducts.where('min_age', '<=', req.query.min_age)
    }

    if (req.query.difficulty_id) {
        allProducts.where('difficulty_id', '=', req.query.difficulty_id)
    }

    if (req.query.categories) {
        allProducts.query('join', 'categories_products', 'products.id', 'product_id')
            .where('category_id', 'in', req.query.categories.split(','))
    }

    if (req.query.designers) {
        allProducts.query('join', 'designers_products', 'products.id', 'product_id')
            .where('designer_id', 'in', req.query.designers.split(','))
    }

    if (req.query.mechanics) {
        allProducts.query('join', 'mechanics_products', 'products.id', 'product_id')
            .where('mechanic_id', 'in', req.query.mechanics.split(','))
    }


    let productsResults = await allProducts.fetch({
        withRelated: ['difficulty', "origin", "categories", "designers", "mechanics", "images"]
    })

    let message = {}
    // console.log(productsResults.toJSON().length)

    if(productsResults.toJSON().length < 1){
        message.message = "No product found"
    } else {
        message.results_found = productsResults.toJSON().length
        message.results = productsResults
    }

    // console.log(productsResults.toJSON())
    res.status(200)
    res.json(message)
})


//get product via ID
router.get('/:product_id/id', async (req, res) => {
    const productViaID = Product.collection()

    let result = await productViaID.where( "id", "=", req.params.product_id ).fetch({
        withRelated: ['difficulty', "origin", "categories", "designers", "mechanics", "images"]
    })

    let message = {}
    // console.log(productsResults.toJSON().length)

    if(result.length != 0){
        message.results = result
    } else {
        message.message = "No product found"
    }

    // console.log(result)
    res.status(200)
    res.json(message)
})

router.get('/tables', async (req, res) => {

    const difficulties = await Difficulty.fetchAll()
    const categories = await Category.fetchAll()
    const designers = await Designer.fetchAll()
    const mechanics = await Mechanic.fetchAll()

    let extend = {
        "difficulty":difficulties,
        "categories":categories,
        "designers":designers,
        "mechanics":mechanics,
    }

    // console.log(extend)dsdaasd

    res.status(200)
    res.json(extend)
})

module.exports = router;