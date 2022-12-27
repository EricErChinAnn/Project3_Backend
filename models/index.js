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







//User
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

const Customer = bookshelf.model("Customer",{
    tableName:"customers"
})



module.exports = { 
    Product , Difficulty , Category, Designer , Mechanic,
    Employee, Role,
    Customer
};