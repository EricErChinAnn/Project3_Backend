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
  db.insert("designers",
  [
    'designer',
    'bio'
  ],
  [
    'Isaac Childres',
    "Isaac Childres is a game designer and a one-man army of board game design and development. Childres graduated from Bakersfield High School in Bakersfield, California, in 2000."
  ]);

db.insert("designers",
[
  'designer',
  'bio'
],
[
  'Gavan Brown',
  "Gavan Brown is a game designer and runner located in Calgary, Canada. "
]);

db.insert("designers",
[
  'designer',
  'bio'
],
[
  'Matt Leacock',
  "Matt Leacock is a game designer and user experience designer who is probably best known for creating the very popular game Pandemic."
]);

db.insert("designers",
[
  'designer',
  'bio'
],
[
  'Mathias Wigge',
  "Mathias Wigge is a German board game designer."
]);

db.insert("designers",
[
  'designer',
  'bio'
],
[
  'Christian Petersen',
  "Christian Petersen is the founder and CEO of Fantasy Flight Games, as well as one of their main game designers."
]);

db.insert("designers",
[
  'designer',
  'bio'
],
[
  'Jacob Fryxelius',
  "Game developer from Sweden. Co-owner of FryxGames trade company."
]);

db.insert("designers",
[
  'designer',
  'bio'
],
[
  'Francesco Nepitello',
  "Francesco Nepitello is an Italian game designer."
]);

  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
