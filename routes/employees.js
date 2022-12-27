const express = require("express");
const router = express.Router();

const { Employee } = require("../models/index");

const { bootstrapField, createEmployeeLogin } = require('../forms');
const { FullEmployeeForm } = require("../functions/employee")

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
                "password": form.data.password,
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

    const employeeLogin = await createEmployeeLogin();
    res.render('employees/login',{
        "form": employeeLogin.toHTML(bootstrapField)
    })
})

router.post('/login', async (req, res) => {

    const employeeLogin = await createEmployeeLogin();

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
                
                if (employee.get('password') === form.data.password) {
                    
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

            res.render('users/login', {
                'form': form.toHTML(bootstrapField)
            })

        }, 'empty' :(form)=>{

            req.flash("error_messages", "There are some problems logging you in. Please fill in the form again")
            
            res.render('users/login', {
                'form': form.toHTML(bootstrapField)
            })

        }
    })
})


router.get('/profile', (req, res) => {
    const employee = req.session.employee;
    if (!employee) {
        req.flash('error_messages', 'You do not have permission to view this page');
        res.redirect('/employees/login');
    } else {
        res.render('employees/profile',{
            'employee': employee
        })
    }

})





module.exports = router;