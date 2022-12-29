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
  return db.createTable("customers",{
    id:{
      type: 'int',
      unsigned: true,
      notNull: true,
      primaryKey: true,
      autoIncrement: true
    },
    username : {
      type: 'string',
      notNull: true,
      length: "75"
    },
    email : {
      type: 'string',
      notNull: true,
      length: "155"
    },
    password : {
      type: 'string',
      notNull: true,
      length: "155"
    },
    dob:{
      type:"date",
      notNull:true,
    },
    contact:{
      type:"int",
      notNull: true,
      unsigned:true
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
    }

  });
};

exports.down = function(db) {
  return db.dropTable("customers");
};

exports._meta = {
  "version": 1
};
