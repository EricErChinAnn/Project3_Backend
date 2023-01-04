const express = require('express');
const router = express.Router();

const OrderServices = require("../services/order")

router.get('/', async(req,res)=>{
    let order = new OrderServices();

    let allOrder = await order.getAllOrder()
    let allStatuses = await order.getAllStatuses()

    res.render('orders/index', {
        'orders': allOrder.toJSON(),
        "statuses":allStatuses.toJSON(),
        "csrfToken":req.csrfToken()
    })
})

router.post('/:order_id/status/update', async(req,res)=>{

    let order = new OrderServices();

    await order.updateStatus(req.params.order_id, req.body.newStatus);

    req.flash("success_messages", "Status updated")
    res.redirect('/orders');

  })


module.exports = router;