const yup = require("yup");

const searchSchema = yup.object({

    name: yup.string(),
    min_cost: yup.number().positive().integer(),
    max_cost: yup.number().positive().integer(),
    player_min: yup.number().positive().integer(),
    player_max: yup.number().positive().integer(),
    avg_duration: yup.number().positive().integer(),
    min_age: yup.number().positive().integer(),
    difficulty_id: yup.string(),
    categories: yup.string(),
    designers: yup.string(),
    mechanics: yup.string(),

})



module.exports = {
    searchSchema
};