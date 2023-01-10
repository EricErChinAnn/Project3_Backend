const yup = require("yup");

const searchSchema = yup.object({

    name: yup.string(),
    // min_cost: yup.number().positive("Number need to be positive").integer("Number cannot be decimal"),
    // max_cost: yup.number().positive("Number need to be positive").integer("Number cannot be decimal"),
    // player_min: yup.number().positive("Number need to be positive").integer("Number cannot be decimal"),
    // player_max: yup.number().positive("Number need to be positive").integer("Number cannot be decimal"),
    // avg_duration: yup.number().positive("Number need to be positive").integer("Number cannot be decimal"),
    // min_age:yup.number().positive("Number need to be positive").integer("Number cannot be decimal"),
    min_cost: yup.number(),
    max_cost: yup.number(),
    player_min: yup.number(),
    player_max: yup.number(),
    avg_duration: yup.number(),
    min_age:yup.number(),
    difficulty_id: yup.string(),
    categories: yup.string(),
    designers: yup.string(),
    mechanics: yup.string(),

})



module.exports = {
    searchSchema
};