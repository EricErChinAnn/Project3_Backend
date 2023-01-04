const { Order, Status } = require("../models/index")
const { updateOrderForm } = require("../forms/index")

async function getAllStatuses() {
    return await Status.fetchAll({
        require: false
    })
}

const getAllOrder = async () => {
    return await Order.fetchAll({
        require: false,
        withRelated: [
            "statuses",
            "customers"
        ]
    });
}

const getAllOrderById = async (orderId) => {
    return await Order.where({
        "id": orderId
    }).fetch({
        require: false,
        withRelated: [
            "statuses"
        ]
    });
}

async function updateStatus(orderId, newStatusId) {
    try{
        let orderItem = await getAllOrderById();
        if (orderItem) {
            orderItem.set('status_id', newStatusId);
            orderItem.save();
            return true;
        }
        return false;
    }catch(e){
        console.log(e)
        return false;
    }
   
}

module.exports = {
    getAllStatuses,
    getAllOrder,
    getAllOrderById,
    updateStatus
}