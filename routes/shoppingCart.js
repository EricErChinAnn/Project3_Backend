const express = require("express");
const router = express.Router();


const CartServices = require('../services/cart_services');

router.get('/', async(req,res)=>{

if(req.session.customer.id){

    let cart = new CartServices(req.session.customer.id);
    // let cart = new CartServices(2);
    // console.log(req)

    let asd = (await cart.getCart())

    // console.log(asd)

    res.render('cart/index', {
        'shoppingCart': (await cart.getCart()).toJSON()
    })

} else {

 req.flash('error_messages', 'Access denied')
 res.redirect('/products')

}

})


router.get('/:product_id/add', async (req,res)=>{

    if(req.session.customer.id){

    let cart = new CartServices(req.session.customer.id);

    await cart.addToCart(req.params.product_id, 1);

    req.flash('success_messages', 'Successfully added to cart')

    res.redirect('/products')

    } else {

        req.flash('error_messages', 'Access denied')
        res.redirect('/products')

    }

})


router.get('/:product_id/remove', async(req,res)=>{
if(req.session.customer.id){

    let cart = new CartServices(req.session.customer.id);
    req.flash("success_messages", `Item has been removed`);
    
    await cart.remove(req.params.product_id);
    res.redirect('/cart');

} else {

    req.flash('error_messages', 'Access denied')
    res.redirect('/products')

}


})



router.post('/:product_id/quantity/update', async(req,res)=>{

    if(req.session.customer.id){

    let cart = new CartServices(req.session.customer.id);
    await cart.setQuantity(req.params.product_id, req.body.newQuantity);
    req.flash("success_messages", "Quantity updated")
    res.redirect('/cart');
        
    } else {

        req.flash('error_messages', 'Access denied')
        res.redirect('/products')

    }

  })




module.exports = router;