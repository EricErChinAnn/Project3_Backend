const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);
const csrf = require('csurf')


const helpers = require('handlebars-helpers')();


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

app.use(csrf());

app.use(function (err, req, res, next) {
    if (err && err.code == "EBADCSRFTOKEN") {
        req.flash('error_messages', 'Form session has expired. Please try again');
        res.redirect('back');
    } else {
        next()
    }
});

app.use(function(req,res,next){
    res.locals.csrfToken = req.csrfToken();
    next();
})



const landingRoutes = require("./routes/landing")
const productsRoutes = require("./routes/products")
const employeesRoutes = require("./routes/employees")
const customersRoutes = require("./routes/customers")


async function main(){

    app.use("/", landingRoutes)
    app.use("/products", productsRoutes)
    app.use("/employees", employeesRoutes)
    app.use("/customers", customersRoutes)
}

main();

app.listen(3000,()=>{
    console.log("Server is LIVE")
})