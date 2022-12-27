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

module.exports = {
    getAllRoles, 
    FullEmployeeForm,
}