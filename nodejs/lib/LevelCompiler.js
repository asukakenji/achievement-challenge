'use strict';

let Utils = require('./Utils');

class LevelCompiler {

  /**
   * Compiles a level object to a trigger object.
   */
  static compile(level_object) {
    let lv = Utils.checkNumber(level_object.lv);
    let xp = Utils.checkNumber(level_object.xp);
    if (lv <= 0) throw new RangeError('Invalid lv value');
    if (xp <= 0) throw new RangeError('Invalid xp value');
    let name = 'lv' + Utils.padZero(3, lv + 1);
    let trigger_object = {
      'name': name,
      'queue': 'lv',
      'target': 'player',
      'condition': {
        'lv': { '$eq': lv },
        'xp': { '$gte': xp }
      },
      'action': {
        '$inc': { 'xp': -xp },
        '$set': { 'lv': lv + 1 }
      }
    };
    //TODO: trigger_object.__proto__ = Trigger.prototype;
    return trigger_object;
  }

}

module.exports = LevelCompiler;
