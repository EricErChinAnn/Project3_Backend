const express = require("express");
const router = express.Router();

const OrderServices = require('../../services/order');
const { checkIfAuthenticatedJWT } = require('../../middlewares');
const { Order } = require("../../models");

router.get("/", checkIfAuthenticatedJWT, async (req, res) => {

    let order = new OrderServices();

    // console.log(req.customer.id)
    
    let allOrder = await order.getAllOrder(req.customer.id)

    // let ordersOfCustomer = []

    // for (let each of allOrder) {

    //     for (let e of each.toJSON().customers) {
    //         if (e.id === req.customer.id) {
    //             ordersOfCustomer.push(each)
    //         }
    //     }
    // }

    let ordersOfCustomer = allOrder.filter((obj) => {

        let objViaCustId = obj.customers.filter(e=>e.id === req.customer.id)
        
        if(objViaCustId.length > 0){
            return true
        } else {
            return false
        }
         
    })

    if (ordersOfCustomer.length < 1) {
        res.status(200)
        res.json({ "error": "No Orders Found" })
    } else {
        // console.log(ordersOfCustomer)
        res.status(200)
        res.json(ordersOfCustomer)
    }
})


module.exports = router;