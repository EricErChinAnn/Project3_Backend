const express = require("express");
const router = express.Router();
const {
    checkIfAuthenticatedEmployee
} = require('../middlewares');

const { Product, Image } = require('../models')
const { bootstrapField } = require("../forms/index")
const {
    replaceMTM,
    FullProductForm,
    FullSearchForm,
    addNewProduct
} = require("../dal/product")

// Get all products

router.get('/', async (req, res) => {

    let searchForm = await FullSearchForm()

    let products = await Product.collection()

    searchForm.handle(req, {
        'empty': async (form) => {

            let productsResult = await products.fetch({
                withRelated: ['difficulty', "origin", "categories", "designers", "mechanics","images"]
            })
            
            res.render('products/index', {
                'products': productsResult.toJSON(),
                'form': form.toHTML(bootstrapField),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })

        },
        'error': async (form) => {

            let productsResult = await products.fetch({
                withRelated: ['difficulty', "origin", "categories", "designers", "mechanics","images"]
            })

            res.render('products/index', {
                'products': productsResult.toJSON(),
                'form': form.toHTML(bootstrapField),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })

        },
        'success': async (form) => {

            if (form.data.name) {
                products.where("name", "like", `%${form.data.name}%`)
            }

            if (form.data.min_cost) {
                products.where('cost', '>=', form.data.min_cost)
            }

            if (form.data.max_cost) {
                products.where('cost', '<=', form.data.max_cost);
            }

            if (form.data.player_min) {
                products.where('player_min', '<=', form.data.player_min)
            }

            if (form.data.player_max) {
                products.where('player_max', '<=', form.data.player_max);
            }

            if (form.data.avg_duration){
                products.where('avg_duration', '<=', form.data.avg_duration);
            }

            if (form.data.min_age) {
                products.where('min_age', '<=', form.data.min_age)
            }

            if (form.data.difficulty_id) {
                products.where('difficulty_id', '=', form.data.difficulty_id)
            }

            if (form.data.categories) {
                products.query('join', 'categories_products', 'products.id', 'product_id')
                .where('category_id', 'in', form.data.categories.split(','))
            }

            if (form.data.designers) {
                products.query('join', 'designers_products', 'products.id', 'product_id')
                .where('designer_id', 'in', form.data.designers.split(','))
            }

            if (form.data.mechanics) {
                products.query('join', 'mechanics_products', 'products.id', 'product_id')
                .where('mechanic_id', 'in', form.data.mechanics.split(','))
            }


            let productsResults = await products.fetch({
                withRelated: ['difficulty', "origin", "categories", "designers", "mechanics"]
            })

        
            res.render('products/index', {
                'products': productsResults.toJSON(),
                'form': form.toHTML(bootstrapField),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })


        }
    })

})




// Add Product

router.get('/create', checkIfAuthenticatedEmployee, async (req, res) => {

    const productForm = await FullProductForm();

    res.render('products/create', {
        'form': productForm.toHTML(bootstrapField),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })
})

router.post('/create', checkIfAuthenticatedEmployee, async (req, res) => {

    try {
        
        const productForm = await FullProductForm();

        productForm.handle(req, {
            'success': async (form) => {
    
                const product = await addNewProduct(form.data)
    
                // console.log(product)
    
    
                req.flash("success_messages", `New Product <${form.data.name}> has been created`)
    
                res.redirect('/products');
    
            },
            "empty": async (form) => {
    
                res.render("products/create.hbs", {
                    'form': form.toHTML(bootstrapField),
                    cloudinaryName: process.env.CLOUDINARY_NAME,
                    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                    cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
                })
    
            },
            "error": async (form) => {
    
                res.render("products/create.hbs", {
                    'form': form.toHTML(bootstrapField),
                    cloudinaryName: process.env.CLOUDINARY_NAME,
                    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                    cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
                })
    
            }
        })

    } catch (error) {
        console.log(error)
    }

})







//Edit Product

router.get('/update/:productId', checkIfAuthenticatedEmployee, async (req, res) => {

    const productEdit = await Product.where({
        'id': req.params.productId
    }).fetch({
        require: true,
        withRelated: ['difficulty', "origin", "categories", "designers", "mechanics","images"]
    });

    const productForm = await FullProductForm();

    productForm.fields.name.value = productEdit.get('name');
    productForm.fields.cost.value = productEdit.get('cost');
    productForm.fields.player_min.value = productEdit.get("player_min");
    productForm.fields.player_max.value = productEdit.get("player_max");
    productForm.fields.avg_duration.value = productEdit.get("avg_duration");
    productForm.fields.release_date.value = productEdit.get("release_date").toISOString().slice(0, 10);
    productForm.fields.description.value = productEdit.get('description');
    productForm.fields.stock.value = productEdit.get('stock');
    productForm.fields.min_age.value = productEdit.get('min_age');
    productForm.fields.difficulty_id.value = productEdit.get('difficulty_id');
    productForm.fields.expansion_id.value = productEdit.get('expansion_id');

    let selectedCategories = await productEdit.related('categories').pluck('id');
    productForm.fields.categories.value = selectedCategories;

    let selectedDesigners = await productEdit.related('designers').pluck('id');
    productForm.fields.designers.value = selectedDesigners;

    let selectedMechanics = await productEdit.related('mechanics').pluck('id');
    productForm.fields.mechanics.value = selectedMechanics;




    res.render('products/update', {
        'form': productForm.toHTML(bootstrapField),
        'product': productEdit.toJSON(),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })

})

router.post("/update/:productId", checkIfAuthenticatedEmployee, async (req, res) => {

    const productEdit = await Product.where({
        'id': req.params.productId
    }).fetch({
        require: true,
        withRelated: ['difficulty', "origin", "categories", "designers", "mechanics","images"]
    });

    const productForm = await FullProductForm();

    productForm.handle(req, {
        'success': async (form) => {
            let { categories, designers, mechanics, ...formData } = form.data;
            await productEdit.set(formData);

            let newCategoriesId = categories.split(",");
            let oldCategoriesId = await productEdit.related("categories").pluck("id");

            // await productEdit.category().detach(oldCategoriesId),
            // await productEdit.category().attach(newCategoriesId)
            await replaceMTM(productEdit.categories(), oldCategoriesId, newCategoriesId)

            let newDesignerId = designers.split(",");
            let oldDesignerId = await productEdit.related("designers").pluck("id");
            await replaceMTM(productEdit.designers(), oldDesignerId, newDesignerId);

            let newMechanicId = mechanics.split(",");
            let oldMechanicId = await productEdit.related("mechanics").pluck("id");
            await replaceMTM(productEdit.mechanics(), oldMechanicId, newMechanicId);



            const imagesCurrent = await Image.where({
                'product_id': req.params.productId
            })
            // .fetchAll({
            //     require: true
            // })
            .destroy();
    
            // if(imagesCurrent.toJSON()){
            //     // await imagesCurrent.destroy();
            //     for (let i = 0; i < imagesCurrent.toJSON().length; i++){
            //         await imagesCurrent.destroy();
            //     }
            // }



            let imageArray = form.data.image_url.split(" ")
            let imageThumbArray = form.data.image_url_thumb.split(" ")

            for (let i = 0; i < imageArray.length; i++){
                if(imageArray[i]){
                    const image = new Image();

                    image.set('product_id', req.params.productId);
                    image.set('image_url', imageArray[i]);
                    image.set('image_url_thumb', imageThumbArray[i]);
    
                    await image.save();
                }
            }


            productEdit.save();


            req.flash("success_messages", `<${formData.name}> has been updated`)
            res.redirect('/products');

        },
        "error": async (form) => {

            res.render('products/update', {
                'form': form.toHTML(bootstrapField),
                'product': productEdit.toJSON(),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })

        },
        "empty": async (form) => {

            res.render('products/update', {
                'form': form.toHTML(bootstrapField),
                'product': productEdit.toJSON(),
                cloudinaryName: process.env.CLOUDINARY_NAME,
                cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
                cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
            })

        }
    })
})







//Delete Product 

router.get('/delete/:product_id', checkIfAuthenticatedEmployee, async (req, res) => {
    // fetch the product that we want to delete
    const product = await Product.where({
        'id': req.params.product_id
    }).fetch({
        require: true
    });

    res.render('products/delete', {
        'product': product.toJSON(),
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
    })

});
router.post('/delete/:product_id', checkIfAuthenticatedEmployee, async (req, res) => {
    // fetch the product that we want to delete
    let checkIfExpansion = await Product.where({
        "expansion_id": req.params.product_id
    }).fetch({
        require: false
    });


    if (checkIfExpansion) {

        const product = await Product.where({
            'id': req.params.product_id
        }).fetch({
            require: true
        });

        req.flash("error_messages", `<${product.get('name')}> has existing expansion`)
        res.redirect('/products')

    } else {

        const product = await Product.where({
            'id': req.params.product_id
        }).fetch({
            require: true
        });

        req.flash("error_messages", `<${product.get('name')}> has been deleted`)

        await product.destroy();
        res.redirect('/products')

    }

})





module.exports = router;