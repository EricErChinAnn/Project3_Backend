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
  return db.createTable('designers_products', {
      id: {
        type: 'int',
        unsigned: true,
        notNull: true,
        primaryKey: true,
        autoIncrement: true
      },
      product_id: {
          type: 'int',
          notNull: true,
          unsigned: true,
          foreignKey: {
              name: 'designers_products_product_fk',
              table: 'products',
              rules: {
                  onDelete: 'CASCADE',
                  onUpdate: 'RESTRICT'
              },
              mapping: 'id'
          }
      },
      designer_id: {
          type: 'int',
          notNull: true,
          unsigned:true,
          foreignKey: {
              name: 'designers_products_designer_fk',
              table: 'categories',
              rules: {
                  onDelete: 'CASCADE',
                  onUpdate: 'RESTRICT'
              },
              mapping: 'id'
          }
      }
  });
};

exports.down = function(db) {
  return db.dropTable("designers_products");
};

exports._meta = {
  "version": 1
};
