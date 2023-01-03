const express = require('express');
const router = express.Router();

const CartServices = require('../services/cart_services')
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)


router.get('/', async (req, res) => {

    //get all cart items
    const cart = new CartServices(req.session.customer.id);
    let items = await cart.getCart();



    // step 1 - create line items and metadata
    let lineItems = [];
    let meta = [];

    for (let i of items) {
       const lineItem = {
            'quantity': i.get('quantity'),
            'price_data': {
                'currency':'SGD',
                'unit_amount': i.related('product').get('cost'),
                'product_data':{
                    'name': i.related('product').get('name'), 
                }
            }
        }


        //if have picture then push in if not don't
        let imgOfProduct = (i.related('product').toJSON().images)
        if (imgOfProduct) {
            
            let image_urls = []
            for(let i of imgOfProduct){
                image_urls.push(i.image_url)
            }

             lineItem.price_data.product_data.images = image_urls;
        }
        lineItems.push(lineItem);

        // save the quantity data along with the product id
        meta.push({
            'product_id' : i.get('product_id'),
            'quantity': i.get('quantity')
        })
    }



    // step 2 - create stripe payment
    let metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types: ['card',"paynow","grabpay"],
        mode:'payment',
        line_items: lineItems,
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_ERROR_URL,
        metadata: {
            'orders': metaData
        }
    }



    // step 3: create the session
    let stripeSession = await Stripe.checkout.sessions.create(payment)
    res.render('checkout/checkout', {
        'sessionId': stripeSession.id, // 4. Get the ID of the session
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
    })


})






router.post('/process_payment', express.raw({type: 'application/json'}), async (req, res) => {
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers["stripe-signature"];
    let event = null;

    console.log(req.body)
    console.log(process.env.STRIPE_ENDPOINT_SECRET)
    console.log(req.headers["stripe-signature"])

    try {
        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);

    } catch (e) {
        res.status(500);
        res.send({
            'error': e.message
        })
        // console.log(e.message)
        return
    }

    if (event.type == 'checkout.session.completed') {
        let stripeSession = event.data.object;
        // console.log(stripeSession);
        // process stripeSession
    }
    res.sendStatus(200);
    // res.send({ received: true });
})







router.get('/success', function(req,res){
    res.render('checkout/success')
})

router.get('/cancelled', function(req,res){
    res.render("checkout/cancelled")
})










module.exports = router;