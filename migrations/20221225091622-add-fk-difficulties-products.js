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
  return db.addColumn('products', 'difficulty_id',{
      'type':'int',
      'unsigned': true,
      'notNull':true,
      'foreignKey': {
        'name':'difficulty_product_fk',
        'table':'difficulties',
        'mapping':'id',
        'rules':{
          'onDelete': 'cascade',
          'onUpdate': 'restrict'
        }
      }    
  });
};

exports.down = function(db) {
  db.removeForeignKey("products", "difficulty_product_fk");
  return db.removeColumn('products', 'difficulty_id');
};

exports._meta = {
  "version": 1
};
