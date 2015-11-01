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
    it('should compile the target correctly', function () {
      assert.deepEqual(
        new Spin(),
        {
          'wager': 0,
          'payout': 0,
          'xp': 0
        }
      );
      assert.deepEqual(
        new Spin(100, 150, 100),
        {
          'wager': 100,
          'payout': 150,
          'xp': 100
        }
      );
      assert.deepEqual(
        new Spin(100, 50, 100),
        {
          'wager': 100,
          'payout': 50,
          'xp': 100
        }
      );
    });
  });

});
