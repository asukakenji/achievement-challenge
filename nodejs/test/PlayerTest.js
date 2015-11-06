'use strict';

const Player = require('../lib/Player');
const assert = require('assert');

describe('Player', function () {

  describe('#constructor()', function () {
    it('should throw TypeError', function() {
      assert.throws(() => new Player({}), TypeError);
      assert.throws(() => new Player('Username', {}), TypeError);
      assert.throws(() => new Player('Username', 'Password', {}), TypeError);
      assert.throws(() => new Player('Username', 'Password', 1, {}), TypeError);
      assert.throws(() => new Player('Username', 'Password', 1, 0, {}), TypeError);
      assert.throws(() => new Player('Username', 'Password', 1, 0, 100, {}), TypeError);
      assert.throws(() => new Player('Username', 'Password', 1, 0, 100, 3000, {}), TypeError);
      assert.throws(() => new Player('Username', 'Password', 1, 0, 100, 3000, [], {}), TypeError);
      assert.throws(() => new Player('Username', 'Password', 1, 0, 100, 3000, [], [], {}), TypeError);
      assert.throws(() => new Player('Username', 'Password', 1, 0, 100, 3000, [], [], 0, {}), TypeError);
      assert.throws(() => new Player('Username', 'Password', 1, 0, 100, 3000, [], [], 0, 0, {}), TypeError);
      assert.throws(() => new Player('Username', 'Password', 1, 0, 100, 3000, [], [], 0, 0, 0, {}), TypeError);
    });
    it('should throw RangeError', function() {
      assert.throws(() => new Player('Username', 'Password', 0, 0, 100, 3000, [], [], 0, 0, 0, 0), RangeError);
      assert.throws(() => new Player('Username', 'Password', 1, -1, 100, 3000, [], [], 0, 0, 0, 0), RangeError);
      assert.throws(() => new Player('Username', 'Password', 1, 0, -1, 3000, [], [], 0, 0, 0, 0), RangeError);
      assert.throws(() => new Player('Username', 'Password', 1, 0, 100, -1, [], [], 0, 0, 0, 0), RangeError);
      assert.throws(() => new Player('Username', 'Password', 1, 0, 100, 3000, [], [], -1, 0, 0, 0), RangeError);
      assert.throws(() => new Player('Username', 'Password', 1, 0, 100, 3000, [], [], 0, -1, 0, 0), RangeError);
      assert.throws(() => new Player('Username', 'Password', 1, 0, 100, 3000, [], [], 0, 0, -1, 0), RangeError);
      assert.throws(() => new Player('Username', 'Password', 1, 0, 100, 3000, [], [], 0, 0, 0, -1), RangeError);
    });
    it('should create the player correctly #1', function () {
      let player1 = new Player('Username', 'Password');
      let player2 = {
        '_id': 'Username',
        'password': 'Password',
        'lv': 1,
        'xp': 0,
        'lp': 100,
        'chips': 3000,
        'achievements': [],
        'mails': [],
        'spinAccumulated': 0,
        'wagerAccumulated': 0,
        'payoutAccumulated': 0,
        'bonusAccumulated': 0
      };
      Object.setPrototypeOf(player2, Player.prototype);
      assert.deepStrictEqual(player1, player2);
    });
  });

});
