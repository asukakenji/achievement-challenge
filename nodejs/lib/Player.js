'use strict';

let Utils = require('./Utils');

class Player {

  /* Constructor of Player */
  constructor(username, password, lv, xp, lp, chips, achievements, mails, spinAccumulated, wagerAccumulated, payoutAccumulated, bonusAccumulated) {
    // User properties
    this._id = Utils.checkNonEmptyString(username);
    this.password = Utils.checkNonEmptyString(password);

    // Player properties
    this.lv = Utils.checkNumber(lv, 1);                      // Level
    this.xp = Utils.checkNumber(xp, 0);                      // Experience Points
    this.lp = Utils.checkNumber(lp, 100);                    // Loyalty Points
    this.chips = Utils.checkNumber(chips, 3000);             // Chips
    this.achievements = Utils.checkArray(achievements, []);  // Achievements
    this.mails = Utils.checkArray(mails, []);                // Mails

    // Player properties (accumulated)
    this.spinAccumulated = Utils.checkNumber(spinAccumulated, 0);      // Spin = Number of Spins
    this.wagerAccumulated = Utils.checkNumber(wagerAccumulated, 0);    // Wager = Chips Paid for a Spin
    this.payoutAccumulated = Utils.checkNumber(payoutAccumulated, 0);  // Payout = Chips Won for a Spin
    this.bonusAccumulated = Utils.checkNumber(bonusAccumulated, 0);    // Bonus = Chips Got from Non-Spin Means
  }

}

module.exports = Player;
