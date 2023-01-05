const yup = require("yup");

const registerSchema = yup.object({

    username: yup.string().required(),
    email: yup.string().email("Invalid Email").required("Required"),

    password: yup.string().required("Required"),
    password_confirm: yup.string().required("Required"),
    
    dob: yup.date().required("Required"),
    contact: yup.number().positive("Number must be positive").integer("Decimal not allowed").required("Required"),
    postal_code: yup.string().required("Required"),
    address_line_1: yup.string().required("Required"),
    address_line_2: yup.string(),
    country: yup.string().required("Required"),

})


module.exports = {
    registerSchema
};