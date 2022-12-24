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
  db.insert("mechanics", ['mechanic'], ['Acting']);
  db.insert("mechanics", ['mechanic'], ['Action']);
  db.insert("mechanics", ['mechanic'], ['Alliances']);
  db.insert("mechanics", ['mechanic'], ['Auction']);
  db.insert("mechanics", ['mechanic'], ['Betting & Bluffing']);
  db.insert("mechanics", ['mechanic'], ['Campaign']);
  db.insert("mechanics", ['mechanic'], ['Card Play']);
  db.insert("mechanics", ['mechanic'], ['Connections']);
  db.insert("mechanics", ['mechanic'], ['Cooperative Game']);
  db.insert("mechanics", ['mechanic'], ['Critical Hits and Failures']);
  db.insert("mechanics", ['mechanic'], ['Deck Construction']);
  db.insert("mechanics", ['mechanic'], ['Deduction']);
  db.insert("mechanics", ['mechanic'], ['Dice Rolling']);
  db.insert("mechanics", ['mechanic'], ['Drawing']);
  db.insert("mechanics", ['mechanic'], ['Drafting']);
  db.insert("mechanics", ['mechanic'], ['Events']);
  db.insert("mechanics", ['mechanic'], ['Finale Ending']);
  db.insert("mechanics", ['mechanic'], ['Grid / Hexagon Management']);
  db.insert("mechanics", ['mechanic'], ['Hidden Roles']);
  db.insert("mechanics", ['mechanic'], ['Interrupts']);
  db.insert("mechanics", ['mechanic'], ['Investment']);
  db.insert("mechanics", ['mechanic'], ['Layering']);
  db.insert("mechanics", ['mechanic'], ['Matching']);
  db.insert("mechanics", ['mechanic'], ['Melding and Splaying']);
  db.insert("mechanics", ['mechanic'], ['Memory']);
  db.insert("mechanics", ['mechanic'], ['Multi-Use Cards']);
  db.insert("mechanics", ['mechanic'], ['Narrative Choice / Paragraph']);
  db.insert("mechanics", ['mechanic'], ['Negotiation']);
  db.insert("mechanics", ['mechanic'], ['Ordering']);
  db.insert("mechanics", ['mechanic'], ['Paper-and-Pencil']);
  db.insert("mechanics", ['mechanic'], ['Pattern']);
  db.insert("mechanics", ['mechanic'], ['Push Your Luck']);
  db.insert("mechanics", ['mechanic'], ['Predictive']);
  db.insert("mechanics", ['mechanic'], ['Role Playing']);
  db.insert("mechanics", ['mechanic'], ['Scenario / Mission / Campaign Game']);
  db.insert("mechanics", ['mechanic'], ['Simulation']);
  db.insert("mechanics", ['mechanic'], ['Singing']);
  db.insert("mechanics", ['mechanic'], ['Solo / Solitaire Game']);
  db.insert("mechanics", ['mechanic'], ['Storytelling']);
  db.insert("mechanics", ['mechanic'], ['Team-Based Game']);
  db.insert("mechanics", ['mechanic'], ['Trading']);
  db.insert("mechanics", ['mechanic'], ['Traitor Game']);
  db.insert("mechanics", ['mechanic'], ['Turn-based']);
  db.insert("mechanics", ['mechanic'], ['Victory Points']);
  db.insert("mechanics", ['mechanic'], ['Voting']);
  db.insert("mechanics", ['mechanic'], ['Zone of Control']);
  
  return null;
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
