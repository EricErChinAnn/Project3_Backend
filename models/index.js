const bookshelf = require('../bookshelf')

const Product = bookshelf.model('Product', {
    tableName:'products',
    expansion(){
        return this.belongsTo("Product","products")
    },
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

module.exports = { Product , Difficulty , Category, Designer , Mechanic};