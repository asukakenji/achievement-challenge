'use strict';

const Spin = require('../lib/Spin');
const assert = require('assert');

describe('Spin', function () {

  describe('#constructor()', function () {
    it('should throw TypeError', function() {
      assert.throws(() => new Spin({}, 0, 0), TypeError);
      assert.throws(() => new Spin(0, {}, 0), TypeError);
      assert.throws(() => new Spin(0, 0, {}), TypeError);
    });
    it('should throw RangeError', function() {
      assert.throws(() => new Spin(-1, 0, 0), RangeError);
      assert.throws(() => new Spin(0, -1, 0), RangeError);
      assert.throws(() => new Spin(0, 0, -1), RangeError);
    });
    it('should create the spin correctly #1', function () {
      let spin1 = new Spin();
      let spin2 = {
        'wager': 0,
        'payout': 0,
        'xp': 0
      };
      Object.setPrototypeOf(spin2, Spin.prototype);
      assert.deepStrictEqual(spin1, spin2);
    });
    it('should create the spin correctly #2', function () {
      let spin1 = new Spin(100, 150, 100);
      let spin2 = {
        'wager': 100,
        'payout': 150,
        'xp': 100
      };
      Object.setPrototypeOf(spin2, Spin.prototype);
      assert.deepStrictEqual(spin1, spin2);
    });
    it('should create the spin correctly #3', function () {
      let spin1 = new Spin(100, 50, 100);
      let spin2 = {
        'wager': 100,
        'payout': 50,
        'xp': 100
      };
      Object.setPrototypeOf(spin2, Spin.prototype);
      assert.deepStrictEqual(spin1, spin2);
    });
  });

});
