const { Order, Status, } = require("../models/index")
const { searchOrderForm } = require("../forms/index")

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
        let orderItem = await getAllOrderById(orderId);
        if (orderItem) {
            orderItem.set('status_id', newStatusId);
            orderItem.save();
            return true;
        }
        return false;
    }catch(e){

        // console.log(e)
        return false;
    }
   
}

async function orderSearchForm() {

    const allStatuses = await (await Status.fetchAll()).map((e)=>{
        return [e.get('id'), e.get('status')];
    })

   allStatuses.unshift(["","All Statuses"]);

   return searchOrderForm(allStatuses)
}

module.exports = {
    getAllStatuses,
    getAllOrder,
    getAllOrderById,
    updateStatus,
    orderSearchForm
}