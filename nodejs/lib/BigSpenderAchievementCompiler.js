'use strict';

let Utils = require('./Utils');

/**
 * Big Spender - Achievement for wager amount (total chips spent)
 */
class BigSpenderAchievementCompiler {

  /**
   * Compiles a big spender achievement object to a trigger object.
   */
  static compile(bs_object) {
    let rank = Utils.checkString(bs_object.rank);
    let wagerAccumulated = Utils.checkNumber(bs_object.wagerAccumulated);
    let xp = Utils.checkNumber(bs_object.xp);
    if (wagerAccumulated < 0) throw new RangeError('Invalid wagerAccumulated value');
    if (xp < 0) throw new RangeError('Invalid xp value');
    let name = 'bs_' + rank;
    let trigger_object = {
      'name': name,
      'queue': 'bs',
      'target': 'player',
      'condition': {
        'wagerAccumulated': { '$gte': wagerAccumulated }
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
