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
            }
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
    })
};


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

const createEmployeeLogin = ()=>{
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

module.exports = { 
    bootstrapField, createProductForm,
    createEmployeeForm, createEmployeeLogin
 };