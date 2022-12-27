const {Product , Difficulty, Category, Designer , Mechanic } = require('../models')
const {createProductForm } = require("../forms/index")

async function getAllDifficulties(){
    const allDifficulties = await Difficulty.fetchAll().map((e) => {
        return [e.get('id'), e.get('difficulty')];
    })
    return allDifficulties
}


async function getAllExpansion(){
    let allExpansion = await Product.fetchAll().map((e) => {
        return [e.get('id'), e.get('name')];
    })
    allExpansion.unshift(["", 'No Expansion']);
    return allExpansion
}


async function getAllCategories(){
    const allCategories = await Category.fetchAll().map((e) => {
        return [e.get('id'), e.get('category')];
    })
    return allCategories
}

async function getAllDesigners(){
    const allDesigners = await Designer.fetchAll().map((e) => {
        return [e.get('id'), e.get('designer')];
    })
    return allDesigners
}

async function getAllMechanics(){
    const allMechanics = await Mechanic.fetchAll().map((e) => {
        return [e.get('id'), e.get('mechanic')];
    })
    return allMechanics
}

async function replaceMTM(data,oldArray,newArray){
    await data.detach(oldArray)
    await data.attach(newArray)
}

async function FullProductForm(){

    const allDifficulties = await getAllDifficulties();
    const allExpansion = await getAllExpansion();
    const allCategories = await getAllCategories();
    const allDesigners = await getAllDesigners();
    const allMechanics = await getAllMechanics();

    return createProductForm(allDifficulties,allExpansion,allCategories,allDesigners,allMechanics);
}
module.exports = {
    getAllDifficulties, 
    getAllExpansion, 
    getAllCategories, 
    getAllDesigners,
    getAllMechanics,
    replaceMTM,
    FullProductForm
}




// const allDesigners = await getAllDesigners();
// const allMechanics = await getAllMechanics();
// ,allDesigners,allMechanics

// if(form.data.designers){
//     product.designers().attach(form.data.designers.split(","));
// }
// if(form.data.mechanics){
//     product.mechanics().attach(form.data.mechanics.split(","));
// }