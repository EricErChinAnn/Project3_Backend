const jwt = require('jsonwebtoken');



const checkIfAuthenticatedEmployee = (req, res, next) => {
    if (req.session.employee) {
        next()
    } else {
        
        req.flash("error_messages", "Page access denied, employee login required");
        res.redirect('/employees/login');
    }
}



const checkIfAuthenticatedJWT = (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (err, customer) => {

            if (err) {
                return res.sendStatus(403);
            }
            req.customer = customer;
            next();

        });
    } else {

        res.sendStatus(401);

    }
};



module.exports = {
    checkIfAuthenticatedEmployee,
    checkIfAuthenticatedJWT,
}