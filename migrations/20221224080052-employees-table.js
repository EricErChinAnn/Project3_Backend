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
  return db.createTable("employees",{
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
      length: "50"
    },
    email : {
      type: 'string',
      notNull: true,
      length: "320"
    },
    password : {
      type: 'string',
      notNull: true,
      length: "50"
    }
  });
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
