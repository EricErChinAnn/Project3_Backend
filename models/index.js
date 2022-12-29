const bookshelf = require('../bookshelf')


//Products
const Product = bookshelf.model('Product', {
    tableName:'products',
    origin(){
        return this.belongsTo("Product","expansion_id")
    },
    // expansions() {
    //     return this.belongsToMany("Product","products","id")
    // },
    difficulty(){
        return this.belongsTo("Difficulty")
    },
    categories(){
        return this.belongsToMany('Category')
    },
    designers(){
        return this.belongsToMany('Designer')
    },
    mechanics(){
        return this.belongsToMany('Mechanic')
    },
    images(){
        return this.hasMany("Image")
    }
});

const Difficulty = bookshelf.model('Difficulty', {
    tableName:'difficulties',
    products(){
        return this.hasMany("Product")
    }
});

const Category = bookshelf.model("Category",{
    tableName:"categories",
    product(){
        return this.belongsToMany('Product')
    }
})

const Designer = bookshelf.model("Designer",{
    tableName:"designers",
    product(){
        return this.belongsToMany('Product')
    }
})

const Mechanic = bookshelf.model("Mechanic",{
    tableName:"mechanics",
    product(){
        return this.belongsToMany('Product')
    }
})

const Image = bookshelf.model('Image', {
    tableName:'images',
    products(){
        return this.belongsTo("Product")
    }
});





//User Employee
const Employee = bookshelf.model("Employee",{
    tableName:"employees",
    role(){
        return this.belongsTo("Role")
    },
})

const Role = bookshelf.model('Role', {
    tableName:'roles',
    employee(){
        return this.hasMany("Employee")
    }
});







//Customers
const Customer = bookshelf.model("Customer",{
    tableName:"customers"
})



module.exports = { 
    Product , Difficulty , Category, Designer , Mechanic, Image,
    Employee, Role,
    Customer
};