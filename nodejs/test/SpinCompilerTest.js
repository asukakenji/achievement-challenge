'use strict';

const Spin = require('../lib/Spin');
const SpinCompiler = require('../lib/SpinCompiler');
const assert = require('assert');

describe('SpinCompiler', function () {

  describe('#compile()', function () {
    it('should compile the target correctly', function () {
      assert.deepStrictEqual(
        SpinCompiler.compile(new Spin(100, 150, 100)),
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
      assert.deepStrictEqual(
        SpinCompiler.compile(new Spin(100, 50, 100)),
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
