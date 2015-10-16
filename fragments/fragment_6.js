'use strict';

let levels = {
  'lv002': { 'lv': 1, 'xp': 300 },
  'lv003': { 'lv': 2, 'xp': 700 },
  'lv004': { 'lv': 3, 'xp': 1000 },
  'lv005': { 'lv': 4, 'xp': 1400 }
};

let level_callbacks = (function (levels) {
  let retval = {};
  let names = Object.keys(levels);
  for (let name of names) {
    let value = levels[name]
    let lv = value['lv'];
    let xp = value['xp'];
    retval[name] = make_level_callback(name, lv, xp);
  }
  return retval;
})(levels);

function make_level_callback(name, lv, xp) {
  return function (player) {
    return function () {
      if (player.achievements.indexOf(name) === -1 && player.lv === lv && player.xp >= xp) {
        player.lv = lv + 1;
        player.xp -= xp;
        player.achievements.push(name);
        delete player.callbacks['xp']['level'][name];
        return true;
      }
      return false;
    };
  };
}

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

  attach_player_callbacks(this);
}

/* Another Constructor of Player */
function make_player(object) {
  object.__proto__ = Player.prototype;
  attach_player_callbacks(object);
  return object;
}

function attach_player_callbacks(object) {
  // Callbacks
  object.callbacks = {};
  object.callbacks['xp'] = {};
  object.callbacks['xp']['level'] = {};
  for (let name of Object.keys(level_callbacks)) {
    if (object.achievements.indexOf(name) === -1) {
      object.callbacks['xp']['level'][name] = level_callbacks[name](object);
    }
  }
}

Player.prototype.gainXp = function (value) {
  this.xp += value;
  for (let name of Object.keys(this.callbacks['xp']['level'])) {
    let callback = this.callbacks['xp']['level'][name];
    let retval = callback();
    if (!retval) return;
  }
}

let p1 = new Player();
console.log(p1);
console.log(Object.keys(p1.callbacks.xp.level).length);
p1.gainXp(100);
console.log(p1);
console.log(Object.keys(p1.callbacks.xp.level).length);
p1.gainXp(100);
console.log(p1);
console.log(Object.keys(p1.callbacks.xp.level).length);
p1.gainXp(100);
console.log(p1);
console.log(Object.keys(p1.callbacks.xp.level).length);

let p2 = new Player();
p2.gainXp(1000);
console.log(p2);
console.log(Object.keys(p2.callbacks.xp.level).length);
