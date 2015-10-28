'use strict';

let Utils = require('./Utils');

/**
 * Lucky Star - Achievement for payout amount (chips won in one spin)
 */
class LuckyStarAchievementCompiler {

  /**
   * Compiles a lucky star achievement object to a trigger object.
   */
  static compile(ls_object) {
    let rank = Utils.checkNonEmptyString(ls_object.rank);
    let payout = Utils.checkNumber(ls_object.payout);
    let lp = Utils.checkNumber(ls_object.lp);
    if (payout < 0) throw new RangeError('Invalid payout value');
    if (lp < 0) throw new RangeError('Invalid lp value');
    let name = 'ls_' + rank;
    let trigger_object = {
      'name': name,
      'queue': 'ls',
      'target': 'spin',
      'condition': {
        'payout': { '$gte': payout }
      },
      'action': {
        '$push': {
          'mails': {
            'name': name,
            'lp': lp
          }
        }
      }
    };
    //TODO: trigger_object.__proto__ = Trigger.prototype;
    return trigger_object;
  }

}

module.exports = LuckyStarAchievementCompiler;
