const express = require("express");
const router = express.Router();
const {
    checkIfAuthenticatedEmployee
} = require('../middlewares');

const { Product } = require('../models')
const { bootstrapField } = require("../forms/index")
const {
    replaceMTM,
    FullProductForm,
    FullSearchForm
} = require("../dal/product")

// Get all products

// router.get('/', async (req,res)=>{

//     let products = await Product.collection().fetch({
//         withRelated:['difficulty',"origin","categories","designers","mechanics"]
//     });
//     console.log(products.toJSON())

//     res.render('products/', {
//         'products': products.toJSON()
//     })

// })

router.get('/', async (req, res) => {

    let searchForm = await FullSearchForm()

    let products = await Product.collection()


    searchForm.handle(req, {
        'empty': async (form) => {

            let productsResult = await products.fetch({
                withRelated: ['difficulty', "origin", "categories", "designers", "mechanics"]
            })
            res.render('products/index', {
                'products': productsResult.toJSON(),
                'form': form.toHTML(bootstrapField)
            })

        },
        'error': async (form) => {

            let productsResult = await products.fetch({
                withRelated: ['difficulty', "origin", "categories", "designers", "mechanics"]
            })
            res.render('products/index', {
                'products': productsResult.toJSON(),
                'form': form.toHTML(bootstrapField)
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
                products.where('player_min', '>=', form.data.player_min)
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
                'form': form.toHTML(bootstrapField)
            })


        }
    })

})




// Add Product

router.get('/create', checkIfAuthenticatedEmployee, async (req, res) => {

    const productForm = await FullProductForm();

    res.render('products/create', {
        'form': productForm.toHTML(bootstrapField)
    })
})

router.post('/create', checkIfAuthenticatedEmployee, async (req, res) => {

    const productForm = await FullProductForm();

    productForm.handle(req, {
        'success': async (form) => {
            const product = new Product();

            product.set('name', form.data.name);
            product.set('cost', form.data.cost);
            product.set('player_min', form.data.player_min);
            product.set('player_max', form.data.player_max);
            product.set('avg_duration', form.data.avg_duration);
            product.set('release_date', form.data.release_date);
            product.set('description', form.data.description);
            product.set('stock', form.data.stock);
            product.set('min_age', form.data.min_age);
            product.set('difficulty_id', form.data.difficulty_id);
            if (form.data.expansion_id) {
                product.set('expansion_id', form.data.expansion_id);
            }
            await product.save();
            // let productData = {categories,designers,mechanics, ...form.data}
            // const product = new Product(productData);

            if (form.data.categories) {
                await product.categories().attach(form.data.categories.split(","));
                console.log(form.data.categories.split(","))
            }
            if (form.data.designers) {
                await product.designers().attach(form.data.designers.split(","));
            }
            if (form.data.mechanics) {
                await product.mechanics().attach(form.data.mechanics.split(","));
            }


            // await product.save();
            req.flash("success_messages", `New Product <${product.get('name')}> has been created`)

            res.redirect('/products');

        },
        "empty": async (form) => {

            res.render("products/create.hbs", {
                'form': form.toHTML(bootstrapField)
            })

        },
        "error": async (form) => {

            res.render("products/create.hbs", {
                'form': form.toHTML(bootstrapField)
            })

        }
    })
})







//Edit Product

router.get('/update/:productId', checkIfAuthenticatedEmployee, async (req, res) => {

    const productEdit = await Product.where({
        'id': req.params.productId
    }).fetch({
        require: true,
        withRelated: ['difficulty', "origin", "categories", "designers", "mechanics"]
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
        'product': productEdit.toJSON()
    })

})

router.post("/update/:productId", checkIfAuthenticatedEmployee, async (req, res) => {

    const productEdit = await Product.where({
        'id': req.params.productId
    }).fetch({
        require: true,
        withRelated: ['difficulty', "origin", "categories", "designers", "mechanics"]
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

            productEdit.save();
            req.flash("success_messages", `<${formData.name}> has been updated`)
            res.redirect('/products');

        },
        "error": async (form) => {

            res.render('products/update', {
                'form': form.toHTML(bootstrapField),
                'product': productEdit.toJSON()
            })

        },
        "empty": async (form) => {

            res.render('products/update', {
                'form': form.toHTML(bootstrapField),
                'product': productEdit.toJSON()
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
        'product': product.toJSON()
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