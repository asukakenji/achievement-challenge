'use strict';

const Utils = require('./Utils');

/**
 * Lucky Star - Achievement for payout amount (chips won in one spin)
 */
class LuckyStarAchievementCompiler {

  /**
   * Compiles a lucky star achievement object to a trigger object.
   */
  static compile(ls_object) {
    const rank = Utils.checkNonEmptyString(ls_object.rank);
    const payout = Utils.checkNumberGTE(ls_object.payout, 0);
    const lp = Utils.checkNumberGTE(ls_object.lp, 0);
    const name = 'ls_' + rank;
    const trigger_object = {
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
