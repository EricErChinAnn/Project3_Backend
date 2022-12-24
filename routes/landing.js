const express = require("express");
const router = express.Router(); // #1 - Create a new express Router


//  #2 Add a new route to the Express router
router.get('/', (req,res)=>{
    res.render("landing")
})

router.get("/about",(req,res)=>{
    res.render("landing/about")
})

router.get("/contact",(req,res)=>{
    res.render("landing/contact")
})

module.exports = router; 