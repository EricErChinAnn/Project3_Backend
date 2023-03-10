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
  return db.createTable("images",{
    id:{
      type: 'int',
      unsigned: true,
      notNull: true,
      primaryKey: true,
      autoIncrement: true
    },
    image_url : {
      type: 'string',
      notNull: true,
      length: "255"
    },
    image_url_thumb: {
      type: 'string',
      notNull: true,
      length: "255"
    }
  });
};

exports.down = function(db) {
  return db.dropTable("images");
};

exports._meta = {
  "version": 1
};
