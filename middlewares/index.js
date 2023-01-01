const checkIfAuthenticatedEmployee = (req, res, next) => {
    if (req.session.employee) {
        next()
    } else {
        
        req.flash("error_messages", "Page access denied, employee login required");
        res.redirect('/employees/login');
    }
}



module.exports = {
    checkIfAuthenticatedEmployee,
}