'use strict';

const Utils = require('./Utils');

/**
 * Big Spender - Achievement for wager amount (total chips spent)
 */
class BigSpenderAchievementCompiler {

  /**
   * Compiles a big spender achievement object to a trigger object.
   */
  static compile(bs_object) {
    const rank = Utils.checkNonEmptyString(bs_object.rank);
    const wager_accumulated = Utils.checkNumberGTE(bs_object.wagerAccumulated, 0);
    const xp = Utils.checkNumberGTE(bs_object.xp, 0);
    const name = 'bs_' + rank;
    const trigger_object = {
      'name': name,
      'queue': 'bs',
      'target': 'player',
      'condition': {
        'wagerAccumulated': { '$gte': wager_accumulated }
      },
      'action': {
        '$push': {
          'mails': {
            'name': name,
            'xp': xp
          }
        }
      }
    };
    //TODO: trigger_object.__proto__ = Trigger.prototype;
    return trigger_object;
  }

}

module.exports = BigSpenderAchievementCompiler;
