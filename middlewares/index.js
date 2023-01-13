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

        let token = null
        let authHeadChecker = [...authHeader]

        if(authHeadChecker.includes(" ")){
            token = authHeader.split(' ')[1];
            
        } else { token = authHeader }


        jwt.verify(token, process.env.TOKEN_SECRET, (err, customer) => {
            console.log(err)
            if (err) {
                // console.log("error thrown")
                return res.status(403).json({"error":err});
            }

            // customer.accessToken = req.headers.authorization.split(" ")[1]
            req.customer = customer;
            next();

        });
    } else {

        // console.log("error-401")s
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



const validateRegister = (payload) => async (req, res, next)=>{

    const body = req.body

    // console.log(Object.keys(query).length)

    if(Object.keys(body).length > 0){

        try {
        
            await payload.validate(body);
            return next()
    
        } catch (error) {
    
            return res.status(400).json({error, "text": "Hahaa"})
    
        }

    } else {

        return next()

    }

}

module.exports = {
    checkIfAuthenticatedEmployee,
    checkIfAuthenticatedJWT,
    validateSearch,
    validateRegister,
}