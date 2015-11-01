'use strict';

const Utils = require('./Utils');

/**
 * Experience (xp) represents the value accumulated in the current level
 */
class LevelCompiler {

  /**
   * Compiles a level object to a trigger object.
   */
  static compile(level_object) {
    const lv = Utils.checkNumberGTE(level_object.lv, 0);
    const xp = Utils.checkNumberGTE(level_object.xp, 0);
    const name = 'lv' + Utils.padZero(3, lv + 1);
    const trigger_object = {
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
