const express = require('express')
const router = express.Router();
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { checkIfAuthenticatedJWT } = require('../../middlewares')
const { generateAccessToken } = require("../../dal/employee")

const getHashedPassword = (password) => {
    const sha256 = crypto.createHash('sha256');
    const hash = sha256.update(password).digest('base64');
    return hash;
}

const { Customer, BlacklistedToken } = require("../../models");

router.post('/login', async (req, res) => {

    if (req.body.email) {

        let customer = await Customer.where({
            'email': req.body.email
        }).fetch({
            require: false
        });

        customer = customer.toJSON()

        if (!customer) {

            res.send({
                'error': 'Authentication details you provided are incorrect.'
            })

        } else {

            if (customer.password === getHashedPassword(req.body.password)) {

                let accessToken = generateAccessToken(customer, process.env.TOKEN_SECRET, '15m');
                let refreshToken = generateAccessToken(customer, process.env.REFRESH_TOKEN_SECRET, '2h');


                // let accessToken = generateAccessToken(customer);
                res.send({
                    accessToken, refreshToken
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


router.post('/refresh', async (req, res) => {

    let refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        res.status(401);
        res.json({
            'error': 'No refresh token found'
        })
        return;
    } else {

        let blacklistedToken = await BlacklistedToken.where({
            'token': refreshToken
        }).fetch({
            require: false
        })

        if (blacklistedToken) {
            res.status(401);
            res.json({
                'error': 'The refresh token has already expired'
            })
            return 
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, customer) => {
            if (err) {
                return res.sendStatus(403);
            }
    
            let accessToken = generateAccessToken(customer, process.env.TOKEN_SECRET, '15m');
            res.send({
                'accessToken': accessToken
            });
        })

    }
})


router.post('/logout', async (req, res) => {

    let refreshToken = req.body.refreshToken;

    if (!refreshToken) {
        res.sendStatus(401);
    } else {

        let blacklistedToken = await BlacklistedToken.where({
            'token': refreshToken
        }).fetch({
            require: false
        })

        if (blacklistedToken) {
            res.status(401);
            res.json({
                'error': 'The refresh token has already expired'
            })
            return 
        }

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, customer) => {
            if (err) {
                return res.sendStatus(403);
            }

            const token = new BlacklistedToken();

            token.set('token', refreshToken);
            token.set('date_created', new Date()); // use current date
            await token.save();

            res.send({
                'message': 'logged out'
            })

        })

    }

})









module.exports = router;