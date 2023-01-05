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





const validateSearch = (payload) => async (req, res, next)=>{

    const query = req.query

    // console.log(Object.keys(query).length)

    if(Object.keys(query).length > 0){

        try {
        
            await payload.validate(query);
            return next()
    
        } catch (error) {
    
            return res.status(400).json({error})
    
        }

    } else {

        return next()

    }

}

module.exports = {
    checkIfAuthenticatedEmployee,
    checkIfAuthenticatedJWT,
    validateSearch,
}