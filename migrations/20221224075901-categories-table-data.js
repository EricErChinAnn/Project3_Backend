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
  db.insert("categories", ['category'], ['Abstract Strategy']);
  db.insert("categories", ['category'], ['Action / Dexterity']);
  db.insert("categories", ['category'], ['Adventure']);
  db.insert("categories", ['category'], ['Bluffing']);
  db.insert("categories", ['category'], ['Card Game']);
  db.insert("categories", ['category'], ["Children's Game"]);
  db.insert("categories", ['category'], ["City Building"]);
  db.insert("categories", ['category'], ["Deduction"]);
  db.insert("categories", ['category'], ["Dice"]);
  db.insert("categories", ['category'], ["Economic"]);
  db.insert("categories", ['category'], ["Educational"]);
  db.insert("categories", ['category'], ["Environmental"]);
  db.insert("categories", ['category'], ["Exploration"]);
  db.insert("categories", ['category'], ["Fantasy"]);
  db.insert("categories", ['category'], ["Farming & Fighting"]);
  db.insert("categories", ['category'], ["Game System"]);
  db.insert("categories", ['category'], ["Horror"]);
  db.insert("categories", ['category'], ["Mafia"]);
  db.insert("categories", ['category'], ["Mature / Adult"]);
  db.insert("categories", ['category'], ["Memory"]);
  db.insert("categories", ['category'], ["Miniatures"]);
  db.insert("categories", ['category'], ["Music"]);
  db.insert("categories", ['category'], ["Mythology"]);
  db.insert("categories", ['category'], ["Negotiation"]);
  db.insert("categories", ['category'], ["Number"]);
  db.insert("categories", ['category'], ["Party Game"]);
  db.insert("categories", ['category'], ["Political"]);
  db.insert("categories", ['category'], ["Print & Play"]);
  db.insert("categories", ['category'], ["Puzzle"]);
  db.insert("categories", ['category'], ["Science Fiction"]);
  db.insert("categories", ['category'], ["Spies/Secret Agents"]);
  db.insert("categories", ['category'], ["Sports"]);
  db.insert("categories", ['category'], ["Video Game Theme"]);
  db.insert("categories", ['category'], ["Wargame"]);
  db.insert("categories", ['category'], ["Zombies"]);

  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
