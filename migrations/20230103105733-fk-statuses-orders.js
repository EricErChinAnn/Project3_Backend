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
  return db.addColumn('orders', 'status_id',{
      'type':'int',
      'unsigned': true,
      'foreignKey': {
        'name':'status_order_fk',
        'table':'statuses',
        'mapping':'id',
        'rules':{
          'onDelete': 'cascade',
          'onUpdate': 'restrict'
        }
      }    
  });
};

exports.down = function(db) {
  db.removeForeignKey("orders", "status_order_fk");
  return db.removeColumn('orders', 'status_id');
};

exports._meta = {
  "version": 1
};
