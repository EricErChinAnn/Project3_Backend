const jwt = require('jsonwebtoken');
const { Role } = require('../models/index')
const { createEmployeeForm  } = require('../forms/index');


async function getAllRoles(){
    allRoles = await Role.fetchAll().map((e)=>{
        return [e.get('id'), e.get('role')];
    })
    return allRoles
}

async function FullEmployeeForm(){

    const allRoles = await getAllRoles();

    return createEmployeeForm(allRoles);

}

const generateAccessToken = (customer, secret, expiresIn) => {
    return jwt.sign({
        'username': customer.username,
        'id': customer.id,
        'email': customer.email,
        "dob":customer.dob,
        "contact":customer.contact,
        "postal_code":customer.postal_code,
        "address_line_1":customer.address_line_1,
        "address_line_2":customer.address_line_2,
        "country":customer.country,
    }, secret, {
        'expiresIn': expiresIn
    });
}





module.exports = {
    getAllRoles, 
    FullEmployeeForm,
    generateAccessToken,
}