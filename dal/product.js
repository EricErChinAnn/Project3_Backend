const {Product , Difficulty, Category, Designer , Mechanic , Image } = require('../models')
const {createProductForm, searchProductForm } = require("../forms/index")


async function getAllProductsWithRelated(){
    let allProducts = await Product.fetchAll({
        withRelated: ['difficulty', "origin", "categories", "designers", "mechanics","images"]
    })
    return allProducts
}



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

async function FullSearchForm(){

    const allDifficulties = await getAllDifficulties();
    const allCategories = await getAllCategories();
    const allDesigners = await getAllDesigners();
    const allMechanics = await getAllMechanics();

    allDifficulties.unshift(["", 'All Difficulties']);

    return searchProductForm(allDifficulties,allCategories,allDesigners,allMechanics);
}


async function addNewProduct(formData){

    const product = new Product();

    product.set('name', formData.name);
    product.set('cost', formData.cost);
    product.set('player_min', formData.player_min);
    product.set('player_max',formData.player_max);
    product.set('avg_duration', formData.avg_duration);
    product.set('release_date', formData.release_date);
    product.set('description', formData.description);
    product.set('stock', formData.stock);
    product.set('min_age', formData.min_age);
    product.set('difficulty_id', formData.difficulty_id);
    
    if (formData.expansion_id) {
        product.set('expansion_id', formData.expansion_id);
    }
    const savedProduct = await product.save();

    if (formData.categories) {
        await product.categories().attach(formData.categories.split(","));
    }
    if (formData.designers) {
        await product.designers().attach(formData.designers.split(","));
    }
    if (formData.mechanics) {
        await product.mechanics().attach(formData.mechanics.split(","));
    }
    // console.log("-------------------")
    // console.log(formData.mechanics.split(","))


    
    let imageArray = formData.image_url.split(" ")
    let imageThumbArray = formData.image_url_thumb.split(" ")

    for (let i = 0; i < imageArray.length; i++){
        if(imageArray[i]){
            const image = new Image();

            image.set('product_id', savedProduct.id);
            image.set('image_url', imageArray[i]);
            image.set('image_url_thumb', imageThumbArray[i]);

            await image.save();
        }
    }

    
    
    return product;

}



module.exports = {
    getAllProductsWithRelated,
    getAllDifficulties, 
    getAllExpansion, 
    getAllCategories, 
    getAllDesigners,
    getAllMechanics,
    replaceMTM,
    FullProductForm,
    FullSearchForm,
    addNewProduct
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