const express = require('express');
const { checkIfAuthenticatedJWT } = require('../../middlewares');
const router = express.Router();
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const CartServices = require('../../services/cart_services')

router.get('/', checkIfAuthenticatedJWT, async (req, res) => {

    //get all cart items
    const cart = new CartServices(req.customer.id);
    let items = await cart.getCart();



    // step 1 - create line items and metadata
    let lineItems = [];
    let meta = [];

    for (let i of items) {
        const lineItem = {
            'quantity': i.get('quantity'),
            'price_data': {
                'currency': 'SGD',
                'unit_amount': i.related('product').get('cost'),
                'product_data': {
                    'name': i.related('product').get('name'),
                }
            }
        }


        //if have picture then push in if not don't


        let imgOfProduct = (i.related('product').related("images").toJSON())

        // console.log(imgOfProduct.length)

        if (imgOfProduct.length > 0) {

            let image_urls = []
            for (let i of imgOfProduct) {
                image_urls.push(i.image_url)
            }

            lineItem.price_data.product_data.images = image_urls;
        }
        lineItems.push(lineItem);

        // save the quantity data along with the product id
        meta.push({
            'product_id': i.get('product_id'),
            'quantity': i.get('quantity'),
            "customer_id": i.get('customer_id'),
        })
    }

    // console.log(meta)

    // step 2 - create stripe payment
    let metaData = JSON.stringify(meta);
    const payment = {
        payment_method_types: ['card', "paynow", "grabpay"],
        mode: 'payment',
        line_items: lineItems,
        invoice_creation: { enabled: true },
        payment_intent_data: {
            capture_method: "automatic"
        },
        success_url: process.env.STRIPE_SUCCESS_URL,
        cancel_url: process.env.STRIPE_ERROR_URL,
        shipping_address_collection: {
            allowed_countries: ["SG"],
        },
        shipping_options: [
            {
                shipping_rate_data: {
                    display_name: 'Standard Delivery',
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 500,
                        currency: 'SGD'
                    },
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: '5'
                        },
                        maximum: {
                            unit: 'business_day',
                            value: '7'
                        }
                    }
                }
            },
            {
                shipping_rate_data: {
                    display_name: 'Express Delivery',
                    type: 'fixed_amount',
                    fixed_amount: {
                        amount: 1000,
                        currency: 'SGD'
                    },
                    delivery_estimate: {
                        minimum: {
                            unit: 'business_day',
                            value: '2'
                        },
                        maximum: {
                            unit: 'business_day',
                            value: '4'
                        }
                    }
                }
            }
        ],
        metadata: {
            'orders': metaData
        }
    }



    // step 3: create the session
    let stripeSession = await Stripe.checkout.sessions.create(payment)
    res.render('checkout/checkout', {
        
        // 4. Get the ID of the stripe session
        'sessionId': stripeSession.id, 
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY

    })


})

router.get("/success", function (req, res) {
    res.json({
        "message": "Stripe payment submitted."
    })
})

router.get("/cancelled", function (req, res) {
    res.json({
        "error": "Stripe payment failed to proceed. Please try again later."
    })
})


module.exports = router;