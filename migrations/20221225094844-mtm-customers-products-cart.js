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

exports.up = function (db) {
  return db.createTable('carts', {
      id: {
        type: 'int',
        unsigned: true,
        notNull: true,
        primaryKey: true,
        autoIncrement: true
      },
      customer_id: {
          type: 'int',
          notNull: true,
          unsigned:true,
          foreignKey: {
              name: 'cart_customer_fk',
              table: 'customers',
              rules: {
                  onDelete: 'CASCADE',
                  onUpdate: 'RESTRICT'
              },
              mapping: 'id'
          }
      },
      product_id: {
          type: 'int',
          notNull: true,
          unsigned: true,
          foreignKey: {
              name: 'cart_product_fk',
              table: 'products',
              rules: {
                  onDelete: 'CASCADE',
                  onUpdate: 'RESTRICT'
              },
              mapping: 'id'
          }
      },
      quantity:{
        type:"int",
        unsigned:true,
        notNull:true
      }
  });
};

exports.down = function(db) {
  return db.dropTable("carts");
};

exports._meta = {
  "version": 1
};
