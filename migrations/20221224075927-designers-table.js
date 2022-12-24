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
  return db.createTable("designers",{
    id:{
      type: 'int',
      unsigned: true,
      notNull: true,
      primaryKey: true,
      autoIncrement: true
    },
    designer: {
      type: 'string',
      notNull: true,
      length: "60"
    },
    bio: {
      type: 'string',
      notNull: true,
      length: "255"
    },
  });
};

exports.down = function(db) {
  return db.dropTable("designers");
};

exports._meta = {
  "version": 1
};
