const express = require('express');
const router = express.Router();
const { Order, Status } = require("../models")
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
                'currency': 'SGD',
                'unit_amount': i.related('product').get('cost'),
                'product_data': {
                    'name': i.related('product').get('name'),
                }
            }
        }


        //if have picture then push in if not don't
        let imgOfProduct = (i.related('product').toJSON().images)
        if (imgOfProduct) {

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
        success_url: "https://www.google.com/",
        // process.env.STRIPE_SUCCESS_URL,
        cancel_url: "https://www.yahoo.com/",
        // process.env.STRIPE_ERROR_URL,
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
        'sessionId': stripeSession.id, // 4. Get the ID of the session
        'publishableKey': process.env.STRIPE_PUBLISHABLE_KEY
    })


})






router.post('/process_payment', express.raw({ type: 'application/json' }), async (req, res) => {
    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers["stripe-signature"];
    let event = null;

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

        console.log(stripeSession);

        const receipt = await Stripe.invoices.retrieve(
            stripeSession.invoice
        );

        // console.log("receipt====", receipt)

        const receiptURL = receipt.hosted_invoice_url
        // console.log("hostedInvoiceUrl=====", receiptURL)

        const paymentType = await Stripe.paymentIntents.retrieve(stripeSession.payment_intent)

        // console.log("111111111111111111111111111111111111111111111")
        // console.log(stripeSession.total_details.amount_shipping)



        //Create new order
        const newOrder = new Order()

        newOrder.set("postal_code", stripeSession.customer_details.address.postal_code)
        newOrder.set("address_line_1", stripeSession.customer_details.address.line1)
        newOrder.set("address_line_2", stripeSession.customer_details.address.line2)
        newOrder.set("country", stripeSession.customer_details.address.country)
        newOrder.set("order_date", new Date())
        newOrder.set("shipping_cost", stripeSession.total_details.amount_shipping)
        newOrder.set("receipt_url", receiptURL)
        newOrder.set("payment_type", paymentType.payment_method_types[0])
        newOrder.set("status_id", 1 )


        const saveNewOrder = await newOrder.save();
        // console.log(saveNewOrder)

        let allProductOrderQuantity = JSON.parse(stripeSession.metadata.orders);
            // console.log(allProductOrderQuantity)

        for(let e of allProductOrderQuantity){
            const customerOrder = await newOrder.customers().attach(e)

        }
        


    }
    res.sendStatus(200);
})


router.get('/success', function (req, res) {
    res.render('checkout/success')
})

router.get('/cancelled', function (req, res) {
    res.render("checkout/cancelled")
})










module.exports = router;