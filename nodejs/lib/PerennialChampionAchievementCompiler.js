'use strict';

let Utils = require('./Utils');

/**
 * Perennial Champion - Achievement for payout amount (total chips won)
 */
class PerennialChampionAchievementCompiler {

  /**
   * Compiles a perennial champion achievement object to a trigger object.
   */
  static compile(pc_object) {
    let rank = Utils.checkNonEmptyString(pc_object.rank);
    let payoutAccumulated = Utils.checkNumber(pc_object.payoutAccumulated);
    let xp = Utils.checkNumber(pc_object.xp);
    if (payoutAccumulated < 0) throw new RangeError('Invalid payoutAccumulated value');
    if (xp < 0) throw new RangeError('Invalid xp value');
    let name = 'pc_' + rank;
    let trigger_object = {
      'name': name,
      'queue': 'pc',
      'target': 'player',
      'condition': {
        'payoutAccumulated': { '$gte': payoutAccumulated }
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
