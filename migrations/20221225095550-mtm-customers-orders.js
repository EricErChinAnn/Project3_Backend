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
  return db.createTable('customers_orders', {
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
              name: 'customers_orders_customer_fk',
              table: 'customers',
              rules: {
                  onDelete: 'CASCADE',
                  onUpdate: 'RESTRICT'
              },
              mapping: 'id'
          }
      },
      order_id: {
          type: 'int',
          notNull: true,
          unsigned: true,
          foreignKey: {
              name: 'customers_orders_order_fk',
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
      },
      product_id:{
        type:"int",
        unsigned:true,
        notNull:true
      }
  });
};

exports.down = function(db) {
  return db.dropTable("customers_orders");
};

exports._meta = {
  "version": 1
};
