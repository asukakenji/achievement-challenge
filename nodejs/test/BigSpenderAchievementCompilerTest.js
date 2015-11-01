'use strict';

const BigSpenderAchievementCompiler = require('../lib/BigSpenderAchievementCompiler');
const assert = require('assert');

describe('BigSpenderAchievementCompiler', function () {

  describe('#compile()', function () {
    it('should throw TypeError', function() {
      const bs_object_1 = { 'rank': '', 'wagerAccumulated': 0, 'xp': 0 };
      assert.throws(() => BigSpenderAchievementCompiler.compile(), TypeError);
      assert.throws(() => BigSpenderAchievementCompiler.compile(null), TypeError);
      assert.throws(() => BigSpenderAchievementCompiler.compile({}), TypeError);
      assert.throws(() => BigSpenderAchievementCompiler.compile(bs_object_1), TypeError);
    });
    it('should throw RangeError', function() {
      const bs_object_1 = { 'rank': 'XXX', 'wagerAccumulated': -1, 'xp': 0 };
      const bs_object_2 = { 'rank': 'XXX', 'wagerAccumulated': 0, 'xp': -1 };
      assert.throws(() => BigSpenderAchievementCompiler.compile(bs_object_1), RangeError);
      assert.throws(() => BigSpenderAchievementCompiler.compile(bs_object_2), RangeError);
    });
    it('should compile the target correctly', function () {
      assert.deepEqual(
        BigSpenderAchievementCompiler.compile(
          { 'rank': 'bronze', 'wagerAccumulated': 10000, 'xp': 1000 }
        ),
        {
          'name': 'bs_bronze',
          'queue': 'bs',
          'target': 'player',
          'condition': {
            'wagerAccumulated': { '$gte': 10000 }
          },
          'action': {
            '$push': {
              'mails': {
                'name': 'bs_bronze',
                'xp': 1000
              }
            }
          }
        }
      );
    });
  });

});
