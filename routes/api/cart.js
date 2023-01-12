const express = require("express");
const router = express.Router();

const CartServices = require('../../services/cart_services');
const { checkIfAuthenticatedJWT } = require('../../middlewares');
const { Product, CartItem } = require("../../models");


//Get customers cart
router.get('/', checkIfAuthenticatedJWT, async (req, res) => {

    let cart = new CartServices(req.customer.id);

    let customerCart = await cart.getCart()

    let message = {}

    if (customerCart.toJSON().length < 1) {
        message.message = "Your cart is empty"
    } else {
        message.items_found = customerCart.toJSON().length
        message.results = customerCart
    }

    // console.log(customerCart.toJSON())
    res.status(200)
    res.json(message)

})


//Add 1 item to cart    
router.post('/:product_id/add', checkIfAuthenticatedJWT, async (req, res) => {

    let cart = new CartServices(req.customer.id);
    let message = {}

    let quantity = parseInt(req.body.quantity)

    if (quantity && quantity > 0) {

        let itemAdded = await cart.addToCart(req.params.product_id, quantity);

        let product = await Product.where("id", "=", req.params.product_id).fetch({require:false})

        if (itemAdded) {

            message.message = `<< ${product.get("name")} >> has been added to cart << ${quantity} >> times`

            res.status(200)
            res.json(message)

        } else {

            message.error = `Error occurred when adding to cart, try again later`

            res.status(400)
            res.json(message)

        }

    } else {

        message.error = `Quantity must be a positive whole number`

        res.status(400)
        res.json(message)

    }

})


// //Remove 1 item from cart
router.delete('/:product_id/remove', checkIfAuthenticatedJWT, async (req, res) => {

    let cart = new CartServices(req.customer.id);

    let checkIfProductInCart = await CartItem.where({
        product_id: req.params.product_id,
        customer_id: req.customer.id
    }).fetch({require:false})

    let message = {}

    if (checkIfProductInCart) {

        await cart.remove(req.params.product_id);

        let product = await Product.where("id", "=", req.params.product_id).fetch({require:false})

        message.message = `<< ${product.get("name")} >> has been removed to cart`

        res.status(200)
        res.json(message)

    } else {

        message.error = `Product isn't in cart`

        res.status(200)
        res.json(message)

    }

})


//Edit quantity of items in cart
router.put('/:product_id/quantity/update', checkIfAuthenticatedJWT, async (req, res) => {

    let cart = new CartServices(req.customer.id);
    let message = {}


    // console.log(req)

    let newQuantity = parseInt(req.body.newQuantity)

    if (newQuantity && newQuantity > 0) {

        await cart.setQuantity(req.params.product_id, newQuantity);

        let product = await Product.where("id", "=", req.params.product_id).fetch({})

        message.message = `<< ${product.get("name")} >> quantity have been edited to << ${newQuantity} >>`

        res.status(200)
        res.json(message)

    } else {

        message.error = "New quantity need to be a positive whole number"
        res.json(message)

    }

})


module.exports = router;