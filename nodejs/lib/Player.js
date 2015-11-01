'use strict';

const Utils = require('./Utils');

class Player {

  /* Constructor of Player */
  constructor(username, password, lv, xp, lp, chips, achievements, mails, spinAccumulated, wagerAccumulated, payoutAccumulated, bonusAccumulated) {
    // User properties
    this._id = Utils.checkNonEmptyString(username);
    this.password = Utils.checkNonEmptyString(password);

    // Player properties
    this.lv = Utils.checkNumberGTE(lv, 1, 1);                // Level
    this.xp = Utils.checkNumberGTE(xp, 0, 0);                // Experience Points
    this.lp = Utils.checkNumberGTE(lp, 0, 100);              // Loyalty Points
    this.chips = Utils.checkNumberGTE(chips, 0, 3000);       // Chips
    this.achievements = Utils.checkArray(achievements, []);  // Achievements
    this.mails = Utils.checkArray(mails, []);                // Mails

    // Player properties (accumulated)
    this.spinAccumulated = Utils.checkNumberGTE(spinAccumulated, 0, 0);      // Spin = Number of Spins
    this.wagerAccumulated = Utils.checkNumberGTE(wagerAccumulated, 0, 0);    // Wager = Chips Paid for a Spin
    this.payoutAccumulated = Utils.checkNumberGTE(payoutAccumulated, 0, 0);  // Payout = Chips Won for a Spin
    this.bonusAccumulated = Utils.checkNumberGTE(bonusAccumulated, 0, 0);    // Bonus = Chips Got from Non-Spin Means
  }

}

module.exports = Player;
