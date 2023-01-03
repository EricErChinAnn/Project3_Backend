const express = require('express')
const router = express.Router();
const { Product, Image } = require('../../models/index')

const productDataLayer = require('../../dal/product')


//Get all products
router.get('/', async(req,res)=>{
    res.send(await productDataLayer.getAllProductsWithRelated())
})


//Add new products
router.post('/', async (req, res) => {
    
    const productForm = await productDataLayer.FullProductForm()

    productForm.handle(req, {
        'success': async (form) => {     
            
            let productAdded = await productDataLayer.addNewProduct(form.data)
            
            res.send(productAdded);
        },
        'error': async (form) => {

           let errors = {};

           for (let key in form.fields) {
               if (form.fields[key].error) {
                   errors[key] = form.fields[key].error;
               }
           }

           res.status(400);
           res.json(errors);

        }
    })

})



module.exports = router;