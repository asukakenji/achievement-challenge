'use strict';

const Utils = require('./Utils');

/**
 * Perennial Champion - Achievement for payout amount (total chips won)
 */
class PerennialChampionAchievementCompiler {

  /**
   * Compiles a perennial champion achievement object to a trigger object.
   */
  static compile(pc_object) {
    const rank = Utils.checkNonEmptyString(pc_object.rank);
    const payout_accumulated = Utils.checkNumberGTE(pc_object.payoutAccumulated, 0);
    const xp = Utils.checkNumberGTE(pc_object.xp, 0);
    const name = 'pc_' + rank;
    const trigger_object = {
      'name': name,
      'queue': 'pc',
      'target': 'player',
      'condition': {
        'payoutAccumulated': { '$gte': payout_accumulated }
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

module.exports = PerennialChampionAchievementCompiler;
