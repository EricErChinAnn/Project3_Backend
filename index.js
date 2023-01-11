const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csrf = require('csurf')
const cors = require('cors')

const { getCart } = require("./dal/cart");


const helpers = require('handlebars-helpers')();

hbs.handlebars.registerHelper("dateDisplay", function(date){
    return date.toISOString().slice(0,10)
})

hbs.handlebars.registerHelper("quatityCost", function(quantity,cost){
    return "$" + ((quantity*cost)/100).toFixed(2)
})

hbs.handlebars.registerHelper("totalCartCost", function(shoppingCart){
    let total = 0
    for (let i = 0; i < shoppingCart.length; i++){
        total += (Number(shoppingCart[i].product.cost) * Number(shoppingCart[i].quantity))
    }

    return "$" + ((total)/100).toFixed(2)
})

hbs.handlebars.registerHelper("shippingType", function(shippinCost){
    if(shippinCost === 500){
        return "Standard Delivery"
    } else {
        return "Express Delivery"
    }
})

let app = express()

app.set("view engine","hbs");

app.use(express.static("public"))

wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

hbs.handlebars.registerHelper(helpers)

app.use(
    express.urlencoded({
        extended:false
    })
);

//Need to be before sessions
app.use(cors());

app.use(session({
    store: new FileStore(),
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true
}))
  
app.use(function(req,res,next){
    res.locals.employee = req.session.employee;
    res.locals.customer = req.session.customer;
    next();
})

app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_messages = req.flash("success_messages");
    res.locals.error_messages = req.flash("error_messages");
    next();
});

const csurfInstance = csrf();

app.use(function(req,res,next){
    // console.log("checking for csrf exclusion")
    // exclude whatever url we want from CSRF protection
    if (req.url === "/checkout/process_payment" || req.url.slice(0,5)=="/api/") {
      return next();
    }
    csurfInstance(req,res,next);
  })
  

app.use(function (err, req, res, next) {
    if (err && err.code == "EBADCSRFTOKEN") {
        req.flash('error_messages', 'Form session has expired. Please try again');
        res.redirect('back');
    } else {
        next()
    }
});

app.use(function(req,res,next){
    if(req.csrfToken){
        res.locals.csrfToken = req.csrfToken();
    }
    next();
})

app.use(async(req,res,next)=>{
    if(req.session.customer){
        const cartItems = await getCart(req.session.customer.id)
        res.locals.cartItemCount = cartItems.toJSON().length;
    }else{
        res.locals.cartItemCount = 0;
    }
    next();
})

const landingRoutes = require("./routes/landing")
const productsRoutes = require("./routes/products")
const employeesRoutes = require("./routes/employees")
const customersRoutes = require("./routes/customers")
const cloudinaryRoutes = require("./routes/cloudinary")
const cartRoutes = require("./routes/shoppingCart")
const checkoutRoutes = require("./routes/checkout")
const ordersRoutes = require("./routes/orders")

const api = {
    products:require("./routes/api/products"),
    customers:require("./routes/api/customers"),
    cart:require("./routes/api/cart"),
    checkout:require("./routes/api/checkout"),
    checkoutRaw:require("./routes/api/checkoutRaw"),
    orders:require("./routes/api/orders"),
}

async function main(){

    app.use("/", landingRoutes)
    app.use("/products", productsRoutes)
    app.use("/employees", employeesRoutes)
    app.use("/customers", customersRoutes)
    app.use('/cloudinary', cloudinaryRoutes)
    app.use("/cart",cartRoutes)
    app.use("/checkout",checkoutRoutes)
    app.use("/orders", ordersRoutes)

    app.use('/api/products', express.json(), api.products);
    app.use('/api/customers', express.json(), api.customers);
    app.use('/api/cart', express.json(), api.cart);
    app.use('/api/checkout', express.json(), api.checkout);
    app.use('/api/process_payment', api.checkoutRaw);
    app.use('/api/orders', express.json(), api.orders);
}

main();

app.listen(process.env.PORT || 6000,()=>{
    console.log("Server is LIVE")
})