const express = require("express");
const router = express.Router();
const crypto = require('crypto');

const { Customer } = require("../models/index");

const { bootstrapField, createLogin, createCustomerForm } = require('../forms');

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

router.get('/register', async (req,res)=>{

    const registerForm = await createCustomerForm();
    res.render('employees/register', {
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
                res.redirect('/employees/login');
            } else {
                
                if (customer.get('password') === getHashedPassword(form.data.password)) {
                    

                    // store in session
                    req.session.customer = {
                        id: customer.get('id'),
                        username: customer.get('username'),
                        email: customer.get('email'),
                    }

                    req.flash("success_messages", `Welcome back, ${customer.get('username')}`);
                    res.redirect('/employees/profile');

                } else {

                    req.flash("error_messages", "Sorry, the authentication details you provided does not work.")
                    res.redirect('/employees/login')

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
    const employee = req.session.employee;
    if (!employee) {
        req.flash('error_messages', 'Access Denied');
        res.redirect('/employees/login');
    } else {
        res.render('employees/profile',{
            'employee': employee
        })
    }

})


router.get('/logout', (req, res) => {

    const employee = req.session.employee;
    if (!employee) {
        req.flash('error_messages', 'Access Denied');
        res.redirect('/employees/login');
    } else {
        req.session.employee = null;
        req.flash('success_messages', "Account successfully logged out");
        res.redirect('/employees/login');
    }

})


module.exports = router;