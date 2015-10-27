'use strict';

class Player {
  /* Constructor of Player */
  constructor(username, password) {
    // User properties
    this._id = username;
    this.password = password;

    // Player properties
    this.lv = 1;             // Level
    this.xp = 0;             // Experience Points
    this.lp = 100;           // Loyalty Points
    this.chips = 3000;       // Chips
    this.achievements = [];  // Achievements
    this.mails = [];         // Mails

    // Player properties (accumulated)
    this.spinAccumulated = 0;    // Spin = Number of Spins
    this.wagerAccumulated = 0;   // Wager = Chips Paid for a Spin
    this.payoutAccumulated = 0;  // Payout = Chips Won for a Spin
    this.bonusAccumulated = 0;   // Bonus = Chips Got from Non-Spin Means
  }
}

module.exports = Player;
