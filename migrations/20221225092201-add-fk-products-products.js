'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.addColumn('products', 'expansion_id',{
      'type':'int',
      'unsigned': true,
      'foreignKey': {
        'name':'product_product_fk',
        'table':'products',
        'mapping':'id',
        'rules':{
          'onDelete': 'restrict',
          'onUpdate': 'restrict'
        }
      }    
  });
};

exports.down = function(db) {
  db.removeForeignKey("products", "product_product_fk");
  return db.removeColumn('products', 'expansion_id');
};

exports._meta = {
  "version": 1
};
