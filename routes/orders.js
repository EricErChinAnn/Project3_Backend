const express = require('express');
const { bootstrapField } = require('../forms');
const { checkIfAuthenticatedEmployee } = require('../middlewares');
const { Order } = require('../models');
const router = express.Router();

const OrderServices = require("../services/order")

router.get('/', checkIfAuthenticatedEmployee, async (req, res) => {
    let order = new OrderServices();

    let allOrder = await order.getAllOrder()
    let allStatuses = await order.getAllStatuses()

    let allOrdersSearch = await Order.collection()

    let searchForm = await order.orderSearchForm()

    searchForm.handle(req, {
        "empty": async (form) => {

            res.render('orders/index', {
                'orders': allOrder.toJSON(),
                "statuses": allStatuses.toJSON(),
                'form': form.toHTML(bootstrapField),
            })

        },
        "error": async (form) => {

            res.render('orders/index', {
                'orders': allOrder.toJSON(),
                "statuses": allStatuses.toJSON(),
                'form': form.toHTML(bootstrapField),
            })

        },
        "success": async (form) => {

            if (form.data.id) {
                allOrdersSearch.where("id", "=", form.data.id)
            }

            if (form.data.customers_email) {
                allOrdersSearch.query('join', 'customers_orders', 'orders.id', 'order_id')
                    .where('customer_id', 'in', `%${form.data.customers_email}%`)
                    // Name wrong
            }

            if (form.data.status_id) {
                allOrdersSearch.where('status_id', '=', form.data.status_id)
            }

            let results = await allOrdersSearch.fetch({
                withRelated: ['customers', "statuses"]
            })

            res.render('orders/index', {
                'orders': results.toJSON(),
                "statuses": allStatuses.toJSON(),
                'form': form.toHTML(bootstrapField),
            })

        }
    })


    // res.render('orders/index', {
    //     'orders': allOrder.toJSON(),
    //     "statuses":allStatuses.toJSON()
    // })
})

router.post('/:order_id/status/update', checkIfAuthenticatedEmployee, async (req, res) => {
    try {

        let order = new OrderServices();

        await order.updateStatus(req.params.order_id, req.body.newStatus);
        console.log(req.body.newStatus)

        req.flash("success_messages", "Status updated")
        res.redirect('/orders');

    } catch (error) {
        console.log(error)
    }

})


module.exports = router;