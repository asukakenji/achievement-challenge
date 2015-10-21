'use strict';

/* Constructor of Player */
function Player(username, password) {
  // User properties
  this._id = username;
  this.password = password;

  // Player properties
  this.lv = 1;
  this.xp = 0;
  this.loyalty = 100;
  this.chips = 3000;
  this.achievements = [];
  this.mbox = [];

  // Player properties (accumulated)
  this.wagerAccumulated = 0;
  this.bonusAccumulated = 0;
  this.spinAccumulated = 0;
}

return Player;
