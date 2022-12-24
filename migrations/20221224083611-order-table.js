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
  return db.createTable("orders",{
    id:{
      type: 'int',
      unsigned: true,
      notNull: true,
      primaryKey: true,
      autoIncrement: true
    },
    postal_code:{
      type: 'string',
      notNull: true,
      length: "25"
    },
    address_line_1:{
      type: 'string',
      notNull: true,
      length: "155"
    },
    address_line_2:{
      type: 'string',
      notNull: false,
      length: "155"
    },
    country:{
      type: 'string',
      notNull: true,
      length: "70"
    },
    remark :{
      type: 'string',
      notNull: true,
      length: "155"
    },
    order_date:{
      type:"date",
      notNull:true,
    },
    shipping_cost:{
      type:"int",
      unsigned:true,
      notNull:true
    },
    receipt_url:{
      type: 'string',
      notNull: true,
      length: "255"
    },
    order_date:{
      type: 'date',
      notNull: true
    },
    payment_type:{
      type: 'string',
      notNull: true,
      length: "60"
    }

  });
};

exports.down = function(db) {
  return db.dropTable("orders");
};

exports._meta = {
  "version": 1
};
