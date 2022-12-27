const checkIfAuthenticatedEmployee = (req, res, next) => {
    if (req.session.employee) {
        next()
    } else {
        
        req.flash("error_messages", "Page access denied, employee login required");
        res.redirect('/employees/login');
    }
}

const checkIfAuthenticatedManagement = (req, res, next) => {
    if (req.session.employee.id === 2 || req.session.employee.id === 1) {
        next()
    } else {
        
        req.flash("error_messages", "Page access denied, employee login required");
        res.redirect('/employees/login');
    }
}

module.exports = {
    checkIfAuthenticatedEmployee,
    checkIfAuthenticatedManagement
}