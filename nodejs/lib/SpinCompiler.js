'use strict';

let Utils = require('./Utils');

class SpinCompiler {

  /**
   * Compiles a spin object to a trigger object.
   */
  static compile(spin_object) {
    let wager = Utils.checkNumber(spin_object.wager);
    let payout = Utils.checkNumber(spin_object.payout);
    let xp = Utils.checkNumber(spin_object.xp);
    if (wager < 0) throw new RangeError('Invalid wager value');
    if (payout < 0) throw new RangeError('Invalid payout value');
    if (xp < 0) throw new RangeError('Invalid xp value');
    let trigger_object = {
      'target': 'player',
      'condition': {
        'chips': { '$gte': wager }
      },
      'action': {
        '$inc': {
          'xp' : xp,
          'chips': payout - wager,
          'spinAccumulated': 1,
          'wagerAccumulated': wager,
          'payoutAccumulated': payout
        }
      }
    };
    //TODO: trigger_object.__proto__ = Trigger.prototype;
    return trigger_object;
  }

}

module.exports = SpinCompiler;
