const express = require('express')
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { checkIfAuthenticatedJWT } = require('../../middlewares')

const generateAccessToken = (customer) => {
    return jwt.sign({
        'username': customer.get('username'),
        'id': customer.get('id'),
        'email': customer.get('email'),
        "dob":customer.get('dob'),
        "contact":customer.get('contact'),
        "postal_code":customer.get('postal_code'),
        "address_line_1":customer.get('address_line_1'),
        "address_line_2":customer.get('address_line_2'),
        "country":customer.get('country'),
    }, process.env.TOKEN_SECRET, {
        expiresIn: "1h"
    });
}

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const { Customer } = require("../../models");

router.post('/login', async (req, res) => {

    if (req.body.email) {

        let customer = await Customer.where({
            'email': req.body.email
        }).fetch({
            require: false
        });

        if (!customer) {

            res.send({
                'error': 'Authentication details you provided are incorrect.'
            })

        } else {

            if (customer.get('password') === getHashedPassword(req.body.password)) {

                let accessToken = generateAccessToken(customer);
                res.send({
                    accessToken
                })

            } else {

                res.send({
                    'error': 'Authentication details you provided are incorrect.'
                })

            }
        }

    } else {

        res.send({
            'error': 'Authentication details you provided are incorrect.'
        })

    }

})


router.get('/profile', checkIfAuthenticatedJWT, async (req, res) => {

    const customer = req.customer;
    res.send(customer);

})









module.exports = router;