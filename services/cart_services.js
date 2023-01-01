const cartDataLayer = require('../dal/cart')

class CartServices {

    constructor(customer_id) {
        this.customer_id = customer_id;
    }


    //Add to cart
    async addToCart(productId, quantity) {
        // check if the user has added the product to the shopping cart before
        let cartItem = 
        await cartDataLayer.getCartItemByUserAndProduct(this.customer_id, productId);

       if (cartItem) {
            return await cartDataLayer.updateQuantity
            (this.customer_id, productId, cartItem.get('quantity') + 1);
        } else {
            let newCartItem = cartDataLayer.createCartItem
            (this.customer_id, productId, quantity);
            return newCartItem;
        }
    }


    //Delete from Cart
    async remove(productId) {
        return await cartDataLayer.removeFromCart
        (this.customer_id, productId);
    }



    //update quantity
    async setQuantity(productId, quantity) {
        return await cartDataLayer
                   .updateQuantity(this.customer_id, productId, quantity);
    }


    
    async getCart() {
        return await cartDataLayer.getCart(this.customer_id);
    }

    async getCartItemByUserAndProduct(productId){
        return await cartDataLayer.getCartItemByUserAndProduct(this.customer_id, productId)
    }

}






module.exports = CartServices;