const express = require("express");
const router = express.Router();
const crypto = require('crypto');

const { Employee } = require("../models/index");

const { bootstrapField, createLogin } = require('../forms');
const { FullEmployeeForm } = require("../dal/employee");
const { checkIfAuthenticatedEmployee } = require("../middlewares");

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}


router.get('/', checkIfAuthenticatedEmployee , async (req,res)=>{

    let employees = await Employee.collection().fetch({
        withRelated:['role']
    });

    res.render('employees/', {
        'employees': employees.toJSON()
    })

})


router.get('/register', async (req,res)=>{

    const registerForm = await FullEmployeeForm();
    res.render('employees/register', {
        'form': registerForm.toHTML(bootstrapField)
    })
})

router.post('/register', async (req, res) => {

    const registerForm = await FullEmployeeForm();
    registerForm.handle(req, {
        success: async (form) => {
            const user = new Employee({
                'username': form.data.username,
                'email': form.data.email,
                "password": getHashedPassword(form.data.password),
                "role_id":form.data.role_id
            });
            await user.save();
            req.flash("success_messages", "User signed up successfully!");
            res.redirect('/employees/login')
        },
        'error': (form) => {
            res.render('employees/register', {
                'form': form.toHTML(bootstrapField)
            })
        },
        "empty": (form) => {
            res.render('employees/register', {
                'form': form.toHTML(bootstrapField)
            })
        }
    })
})



router.get('/login', async (req,res)=>{

    const employeeLogin = await createLogin();
    res.render('employees/login',{
        "form": employeeLogin.toHTML(bootstrapField)
    })
})

router.post('/login', async (req, res) => {

    const employeeLogin = await createLogin();

    employeeLogin.handle(req, {
        'success': async (form) => {

            let employee = await Employee.where({
                'email': form.data.email
            }).fetch({
               require:false,
               withRelated:["role"]
            }
            );

            if (!employee) {
                req.flash("error_messages", "Sorry, the authentication details you provided does not work.")
                res.redirect('/employees/login');
            } else {
                
                if (employee.get('password') === getHashedPassword(form.data.password)) {
                    
                    let employeeRole = employee.toJSON()

                    // store in session
                    req.session.employee = {
                        id: employee.get('id'),
                        username: employee.get('username'),
                        email: employee.get('email'),
                        role: employeeRole.role
                    }

                    req.flash("success_messages", `Welcome back, ${employee.get('username')}`);
                    res.redirect('/employees/profile');

                } else {

                    req.flash("error_messages", "Sorry, the authentication details you provided does not work.")
                    res.redirect('/employees/login')

                }
            }

        }, 'error': (form) => {

            req.flash("error_messages", "There are some problems logging you in. Please fill in the form again")

            res.render('employees/login', {
                'form': form.toHTML(bootstrapField)
            })

        }, 'empty' :(form)=>{

            req.flash("error_messages", "There are some problems logging you in. Please fill in the form again")
            
            res.render('employees/login', {
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



router.get('/delete/:employee_id', checkIfAuthenticatedEmployee, async (req, res) => {
    // fetch the product that we want to delete
    const employee = await Employee.where({
        'id': req.params.employee_id
    }).fetch({
        require: true
    });

    res.render('products/delete', {
        'product': employee.toJSON()
    })

});
router.post('/delete/:employee_id', checkIfAuthenticatedEmployee, async (req, res) => {

        const employee = await Employee.where({
            'id': req.params.employee_id
        }).fetch({
            require: true
        });

        req.flash("error_messages", `<${employee.get('username')}> has been deleted`)

        await employee.destroy();
        res.redirect('/products')

})

module.exports = router;