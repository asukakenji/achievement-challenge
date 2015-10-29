'use strict';

let SpinCompiler = require('../lib/SpinCompiler');
let assert = require('assert');

describe('SpinCompiler', function () {

  describe('#compile()', function () {
    it('should throw RangeError', function() {
      let spin_object_1 = { 'rank': 'XXX', 'wager': -1, 'payout': 0, 'xp': 0 };
      let spin_object_2 = { 'rank': 'XXX', 'wager': 0, 'payout': -1, 'xp': 0 };
      let spin_object_3 = { 'rank': 'XXX', 'wager': 0, 'payout': 0, 'xp': -1 };
      assert.throws(() => SpinCompiler.compile(spin_object_1), RangeError);
      assert.throws(() => SpinCompiler.compile(spin_object_2), RangeError);
      assert.throws(() => SpinCompiler.compile(spin_object_3), RangeError);
    });
    it('should compile the target correctly', function () {
      assert.deepEqual(
        SpinCompiler.compile(
          { 'wager': 100, 'payout': 150, 'xp': 100 }
        ),
        {
          'target': 'player',
          'condition': {
            'chips': { '$gte': 100 }
          },
          'action': {
            '$inc': {
              'xp': 100,
              'chips': 50,
              'spinAccumulated': 1,
              'wagerAccumulated': 100,
              'payoutAccumulated': 150
            }
          }
        }
      );
      assert.deepEqual(
        SpinCompiler.compile(
          { 'wager': 100, 'payout': 50, 'xp': 100 }
        ),
        {
          'target': 'player',
          'condition': {
            'chips': { '$gte': 100 }
          },
          'action': {
            '$inc': {
              'xp': 100,
              'chips': -50,
              'spinAccumulated': 1,
              'wagerAccumulated': 100,
              'payoutAccumulated': 50
            }
          }
        }
      );
    });
  });

});
