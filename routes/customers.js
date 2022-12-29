const express = require("express");
const router = express.Router();
const crypto = require('crypto');

const { Customer } = require("../models/index");

const { bootstrapField, createLogin, createCustomerForm } = require('../forms');
const { checkIfAuthenticatedEmployee } = require("../middlewares");

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}


router.get('/', checkIfAuthenticatedEmployee , async (req,res)=>{

    let customers = await Customer.collection().fetch({});

    res.render('customers/', {
        'customers': customers.toJSON()
    })

})




router.get('/register', async (req,res)=>{

    const registerForm = await createCustomerForm();
    res.render('customers/register', {
        'form': registerForm.toHTML(bootstrapField)
    })
})

router.post('/register', async (req, res) => {

    const registerForm = await createCustomerForm();
    registerForm.handle(req, {
        success: async (form) => {
            const user = new Customer({
                'username': form.data.username,
                'email': form.data.email,
                "password": getHashedPassword(form.data.password),
                "dob":form.data.dob,
                "contact":form.data.contact,
                "postal_code":form.data.postal_code,
                "address_line_1":form.data.address_line_1,
                "address_line_2":form.data.address_line_2,
                "country":form.data.country,
            });
            await user.save();
            req.flash("success_messages", "Customer signed up successfully!");
            res.redirect('/customers/login')
        },
        'error': (form) => {
            res.render('customers/register', {
                'form': form.toHTML(bootstrapField)
            })
        },
        "empty": (form) => {
            res.render('customers/register', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})



router.get('/login', async (req,res)=>{

    const customerLogin = await createLogin();
    res.render('customers/login',{
        "form": customerLogin.toHTML(bootstrapField)
    })
})

router.post('/login', async (req, res) => {

    const customerLogin = await createLogin();

    customerLogin.handle(req, {
        'success': async (form) => {

            let customer = await Customer.where({
                'email': form.data.email
            }).fetch({
               require:false
            });

            if (!customer) {
                req.flash("error_messages", "Sorry, the authentication details you provided does not work.")
                res.redirect('/customers/login');
            } else {
                
                if (customer.get('password') === getHashedPassword(form.data.password)) {
                    

                    // store in session
                    req.session.customer = customer

                    req.flash("success_messages", `Welcome back, ${customer.get('username')}`);
                    res.redirect('/customers/profile');

                } else {

                    req.flash("error_messages", "Sorry, the authentication details you provided does not work.")
                    res.redirect('/customers/login')

                }
            }

        }, 'error': (form) => {

            req.flash("error_messages", "There are some problems logging you in. Please fill in the form again")

            res.render('customer/login', {
                'form': form.toHTML(bootstrapField)
            })

        }, 'empty' :(form)=>{

            req.flash("error_messages", "There are some problems logging you in. Please fill in the form again")
            
            res.render('customer/login', {
                'form': form.toHTML(bootstrapField)
            })

        }
    })
})


router.get('/profile', (req, res) => {
    const customer = req.session.customer;
    if (!customer) {
        req.flash('error_messages', 'Access Denied');
        res.redirect('/customers/login');
    } else {
        res.render('customers/profile',{
            'customer': customer
        })
    }

})


router.get('/logout', (req, res) => {

    const customer = req.session.customer;
    if (!customer) {
        req.flash('error_messages', 'Access Denied');
        res.redirect('/customers/login');
    } else {
        req.session.customer = null;
        req.flash('success_messages', "Account successfully logged out");
        res.redirect('/customers/login');
    }

})


router.get('/delete/:customer_id', checkIfAuthenticatedEmployee, async (req, res) => {
    // fetch the product that we want to delete
    const customer = await Customer.where({
        'id': req.params.customer_id
    }).fetch({
        require: true
    });

    res.render('products/delete', {
        'product': customer.toJSON()
    })

});
router.post('/delete/:customer_id', checkIfAuthenticatedEmployee, async (req, res) => {

        const customer = await Customer.where({
            'id': req.params.customer_id
        }).fetch({
            require: true
        });

        req.flash("error_messages", `<${customer.get('username')}> has been deleted`)

        await customer.destroy();
        res.redirect('/products')

})








module.exports = router;