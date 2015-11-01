'use strict';

const Utils = require('./Utils');

/**
 * High Roller - Achievement for wager amount (chips spent in one spin)
 */
class HighRollerAchievementCompiler {

  /**
   * Compiles a high roller achievement object to a trigger object.
   */
  static compile(hr_object) {
    const rank = Utils.checkNonEmptyString(hr_object.rank);
    const wager = Utils.checkNumberGTE(hr_object.wager, 0);
    const xp = Utils.checkNumberGTE(hr_object.xp, 0);
    const bonus = Utils.checkNumberGTE(hr_object.bonus, 0);
    const name = 'hr_' + rank;
    const trigger_object = {
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
            'xp': xp,
            'bonus': bonus
          }
        }
      }
    };
    //TODO: trigger_object.__proto__ = Trigger.prototype;
    return trigger_object;
  }

}

module.exports = HighRollerAchievementCompiler;
