'use strict';

const Utils = require('./Utils');
const Spin = require('./Spin');

/**
 * One spin equals to one "spending chips, winning chips, earning experience" cycle
 */
class SpinCompiler {

  /**
   * Compiles a spin object to a trigger object.
   */
  static compile(spin) {
    const checked_spin = new Spin(spin.wager, spin.payout, spin.xp);
    const trigger_object = {
      'target': 'player',
      'condition': {
        'chips': { '$gte': checked_spin.wager }
      },
      'action': {
        '$inc': {
          'xp' : checked_spin.xp,
          'chips': checked_spin.payout - checked_spin.wager,
          'spinAccumulated': 1,
          'wagerAccumulated': checked_spin.wager,
          'payoutAccumulated': checked_spin.payout
        }
      }
    };
    //TODO: trigger_object.__proto__ = Trigger.prototype;
    return trigger_object;
  }

}

module.exports = SpinCompiler;
