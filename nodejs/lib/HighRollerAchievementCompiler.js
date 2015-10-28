'use strict';

let Utils = require('./Utils');

/**
 * High Roller - Achievement for wager amount (chips spent in one spin)
 */
class HighRollerAchievementCompiler {

  /**
   * Compiles a high roller achievement object to a trigger object.
   */
  static compile(hr_object) {
    let rank = Utils.checkNonEmptyString(hr_object.rank);
    let wager = Utils.checkNumber(hr_object.wager);
    let bonus = Utils.checkNumber(hr_object.bonus);
    let xp = Utils.checkNumber(hr_object.xp);
    if (wager < 0) throw new RangeError('Invalid wager value');
    if (bonus < 0) throw new RangeError('Invalid bonus value');
    if (xp < 0) throw new RangeError('Invalid xp value');
    let name = 'hr_' + rank;
    let trigger_object = {
      'name': name,
      'queue': 'hr',
      'target': 'spin',
      'condition': {
        'wager': { '$gte': wager }
      },
      'action': {
        '$push': {
          'mails': {
            'name': name,
            'bonus': bonus,
            'xp': xp
          }
        }
      }
    };
    //TODO: trigger_object.__proto__ = Trigger.prototype;
    return trigger_object;
  }

}

module.exports = HighRollerAchievementCompiler;
