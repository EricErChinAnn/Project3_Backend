const orderDataLayer = require('../dal/order')

class OrderServices {


    //update status

    async updateStatus(orderId, newStatus) {
        return await orderDataLayer.updateStatus(orderId, newStatus);
    }

    async getAllOrder() {
        return await orderDataLayer.getAllOrder();
    }

    async getAllOrderById(orderId) {
        return await orderDataLayer.getAllOrderById(orderId)
    }

    async getAllStatuses() {
        return await orderDataLayer.getAllStatuses()
    }

    async orderSearchForm() {
        return await orderDataLayer.orderSearchForm()
    }

}






module.exports = OrderServices;