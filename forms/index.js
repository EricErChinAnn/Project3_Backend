const forms = require("forms");

const fields = forms.fields;
const validators = forms.validators;
const widgets = forms.widgets;

var bootstrapField = function (name, object) {
    if (!Array.isArray(object.widget.classes)) { object.widget.classes = []; }

    if (object.widget.classes.indexOf('form-control') === -1) {
        object.widget.classes.push('form-control');
    }

    var validationclass = object.value && !object.error ? 'is-valid' : '';
    validationclass = object.error ? 'is-invalid' : validationclass;
    if (validationclass) {
        object.widget.classes.push(validationclass);
    }

    var label = object.labelHTML(name);
    var error = object.error ? '<div class="invalid-feedback">' + object.error + '</div>' : '';

    var widget = object.widget.toHTML(name, object);
    return '<div class="form-group">' + label + widget + error + '</div>';
};

// Products related
const createProductForm = (difficulties, origin ,categories,designers,mechanics) => {
    return forms.create({
        'name': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.maxlength(100)]
        }),
        'cost': fields.number({
            label: "Cost (CENTS)",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer()]
        }),
        'player_min': fields.number({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer()]
        }),
        'player_max': fields.number({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer()]
        }),
        'avg_duration': fields.number({
            label: "Avg Duration (MINS)",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer()]
        }),
        'release_date': fields.date({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget:widgets.date(),
        }),
        'description': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.maxlength(255)]
        }),
        'stock': fields.number({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer()]
        }),
        'min_age': fields.number({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer()]
        }),
        'difficulty_id': fields.string({
            label: "Difficulty",
            required: true,
            errorAfterField: true,
            widget:widgets.select(),
            choices: difficulties
        }),
        'expansion_id': fields.string({
            label: "Expansion",
            errorAfterField: true,
            widget:widgets.select(),
            choices: origin
        }),
        "categories": fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices : categories
        }),
        "designers": fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices : designers
        }),
        "mechanics": fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices : mechanics
        }),
        "image_url": fields.string({
            widget: widgets.hidden()
        }),
        "image_url_thumb": fields.string({
            widget: widgets.hidden()
        }),
    })
};

const searchProductForm = (difficulties ,categories,designers,mechanics)=>{
    return forms.create({
        'name': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.maxlength(100)]
        }),
        'min_cost': fields.number({
            label:"Min Cost",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators': [validators.integer()]
        }),
          'max_cost': fields.number({
            label:"Max Cost",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            'validators': [validators.integer()]
        }),
        'player_min': fields.number({
            label:"Min Player",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer()]
        }),
        'player_max': fields.number({
            label:"Max Player",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer()]
        }),
        'avg_duration': fields.number({
            label: "Max Avg Duration (MINS)",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer()]
        }),
        'min_age': fields.number({
            label:"Min Age",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer()]
        }),
        'difficulty_id': fields.string({
            label: "Difficulty",
            required: false,
            errorAfterField: true,
            widget:widgets.select(),
            choices: difficulties
        }),
        "categories": fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices : categories
        }),
        "designers": fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices : designers
        }),
        "mechanics": fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget: widgets.multipleSelect(),
            choices : mechanics
        }),
    })
}








//Account related
const createEmployeeForm = (roles)=>{
    return forms.create({
        'username': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            length:50,
            validators: [validators.maxlength(50)]
        }),
        'email': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            length:320,
            validators: [validators.maxlength(320)]
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.maxlength(50)]
        }),
        'confirm_password': fields.password({
            required: validators.required('Please re-enter password'),
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [
                validators.matchField('password'),
                validators.maxlength(100)
            ]
        }),
        'role_id': fields.string({
            label: "Role",
            required: true,
            errorAfterField: true,
            widget:widgets.select(),
            choices: roles
        }),
    })
}
const createCustomerForm = (roles)=>{
    return forms.create({
        'username': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            length:75,
            validators: [validators.maxlength(75)]
        }),
        'email': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            length:155,
            validators: [validators.maxlength(155)]
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.maxlength(155)]
        }),
        'confirm_password': fields.password({
            required: validators.required('Please re-enter password'),
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [
                validators.matchField('password'),
                validators.maxlength(155)
            ]
        }),
        'dob': fields.date({
            label:"Date of birth",
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            widget:widgets.date(),
        }),
        'contact': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            // validators: [validators.integer()]
        }),
        'postal_code': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            length:25,
            validators: [validators.maxlength(25)]
        }),
        'address_line_1': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            length:155,
            validators: [validators.maxlength(155)]
        }),
        'address_line_2': fields.string({
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            length:155,
            validators: [validators.maxlength(155)]
        }),
        'country': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            length:155,
            validators: [validators.maxlength(70)]
        }),
    })
}
const createLogin = ()=>{
    return forms.create({
        'email': fields.string({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'password': fields.password({
            required: true,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
    })
}



//orders
const searchOrderForm = ( statuses )=>{
    return forms.create({
        'id': fields.number({
            label:"Order Id",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            },
            validators: [validators.integer()]
        }),
        'customers_email': fields.string({
            label:"Customer Email",
            required: false,
            errorAfterField: true,
            cssClasses: {
                label: ['form-label']
            }
        }),
        'status_id': fields.string({
            label: "Status",
            required: false,
            errorAfterField: true,
            widget:widgets.select(),
            choices: statuses
        })
    })
}

module.exports = { 
    bootstrapField, createProductForm, searchProductForm,
    createEmployeeForm, createCustomerForm, createLogin,
    searchOrderForm,
 };