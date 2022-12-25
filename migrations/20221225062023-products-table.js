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
  return db.createTable("products",{
    id:{
      type: 'int',
      unsigned: true,
      notNull: true,
      primaryKey: true,
      autoIncrement: true
    },
    name:{
      type:"string",
      notNull:true,
      length:"100"
    },
    cost:{
      type:"int",
      unsigned: true,
      notNull: true
    },
    player_min:{
      type:"smallint",
      unsigned: true,
      notNull: true
    },
    player_max:{
      type:"smallint",
      unsigned: true,
      notNull: true
    },
    avg_duration:{
      type:"int",
      unsigned: true,
      notNull: true
    },
    release_date:{
      type:"date",
      notNull:true,
    },
    description:{
      type:"string",
      notNull:true,
      length:"255"
    },
    stock:{
      type:"int",
      unsigned: true,
      notNull: true
    },
    min_age:{
      type:"smallint",
      unsigned: true,
      notNull: true
    }
  });
};

exports.down = function(db) {
  return db,dropTable("products");
};

exports._meta = {
  "version": 1
};
