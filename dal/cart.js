const { CartItem } = require('../models/index')

const getCart = async (customerId) => {
    return await CartItem.collection()
        .where({
            'customer_id': customerId
        }).fetch({
            require: false,
            withRelated: [
                "product",
                'product.difficulty', "product.origin", 
                "product.categories", "product.designers",
                "product.mechanics","product.images"
            ]
        });
}


const getCartItemByUserAndProduct = async (customerId, productId) => {
    return await CartItem.where({
        'customer_id': customerId,
        'product_id': productId
    }).fetch({
        require: false
    });
}


async function createCartItem(customerId, productId, quantity) {

    let cartItem = new CartItem({
        'customer_id': customerId,
        'product_id': productId,
        'quantity': quantity
    })
    await cartItem.save();
    return cartItem;
}


async function removeFromCart(customerId, productId) {
    let cartItem = await getCartItemByUserAndProduct(customerId, productId);
    if (cartItem) {
        await cartItem.destroy();
        return true;
    }
    return false;
}


async function updateQuantity(customerId, productId, newQuantity) {
    let cartItem = await getCartItemByUserAndProduct(customerId, productId);
    if (cartItem) {
        cartItem.set('quantity', newQuantity);
        cartItem.save();
        return true;
    }
    return false;
}

module.exports = {
     getCart, 
     getCartItemByUserAndProduct,
     createCartItem,
     removeFromCart,
     updateQuantity
    }

