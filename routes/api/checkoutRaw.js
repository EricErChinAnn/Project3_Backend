const express = require('express');
const router = express.Router();
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

const { Order , Product } = require("../../models/index")
const CartServices = require('../../services/cart_services')

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {

    let payload = req.body;
    let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
    let sigHeader = req.headers["stripe-signature"];
    let event = null;

    // console.log(payload)

    try {

        event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);

        console.log(event)

        if (event.type == 'checkout.session.completed') {

            console.log("success=============================")
    
            let stripeSession = event.data.object;
    
            // console.log(stripeSession);
    
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
            newOrder.set("status_id", 1)
    
    
            const saveNewOrder = await newOrder.save();
    
            // console.log(saveNewOrder)
    
            let allProductOrderQuantity = JSON.parse(stripeSession.metadata.orders);
            console.log(allProductOrderQuantity)
    
            //clear cart 
            let customerId = allProductOrderQuantity[0].customer_id
    
            let cart = new CartServices(customerId)
            let customerCartViaId = await cart.getCart()
    
            // console.log(customerCartViaId.toJSON())
    
            // Empty Shopping cart
            for (let each of customerCartViaId) {
                await each.destroy();
            }
    
    
    
            for (let e of allProductOrderQuantity) {
    
                let productToEditStock = await Product.where({
                    'id': e.product_id
                }).fetch({
                    require: false,
                });
    
                let startingStock = productToEditStock.toJSON().stock
                // console.log(startingStock)
    
                let remainingStock = startingStock - e.quantity
    
                // console.log(remainingStock)
    
                productToEditStock.set("stock", remainingStock)
                await productToEditStock.save();
    
                let customerOrder = await newOrder.customers().attach(e)
    
            }
        }

    } catch (e) {

        res.status(500);
        res.send({
            'error': e.message
        })
        // console.log(e.message)
        return

    }

    // console.log("Thanks for your purchase")
    res.status(200)
    res.json({"message":"Thanks for your purchase"})

})


module.exports = router;