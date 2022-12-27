const express = require("express");
const hbs = require("hbs");
const wax = require("wax-on");
require("dotenv").config();
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);

let app = express()

app.set("view engine","hbs");

app.use(express.static("public"))

wax.on(hbs.handlebars);
wax.setLayoutPath("./views/layouts");

app.use(
    express.urlencoded({
        extended:false
    })
);

app.use(session({
    store: new FileStore(),
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}))
  
app.use(function(req,res,next){
    res.locals.employee = req.session.employee;
    next();
})

app.use(flash());

app.use(function (req, res, next) {
    res.locals.success_messages = req.flash("success_messages");
    res.locals.error_messages = req.flash("error_messages");
    next();
});


const landingRoutes = require("./routes/landing")
const productsRoutes = require("./routes/products")
const employeesRoutes = require("./routes/employees")


async function main(){

    app.use("/", landingRoutes)
    app.use("/products", productsRoutes)
    app.use("/employees", employeesRoutes)
}

main();

app.listen(3000,()=>{
    console.log("Server is LIVE")
})