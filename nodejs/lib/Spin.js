'use strict';

const Utils = require('./Utils');

class Spin {

  /* Constructor of Spin */
  constructor(wager, payout, xp) {
    this.wager = Utils.checkNumberGTE(wager, 0, 0);
    this.payout = Utils.checkNumberGTE(payout, 0, 0);
    this.xp = Utils.checkNumberGTE(xp, 0, 0);
  }

}

module.exports = Spin;
