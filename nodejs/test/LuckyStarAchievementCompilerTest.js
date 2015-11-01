'use strict';

const LuckyStarAchievementCompiler = require('../lib/LuckyStarAchievementCompiler');
const assert = require('assert');

describe('LuckyStarAchievementCompiler', function () {

  describe('#compile()', function () {
    it('should throw TypeError', function() {
      const ls_object_1 = { 'rank': '', 'payout': 0, 'lp': 0 };
      assert.throws(() => LuckyStarAchievementCompiler.compile(), TypeError);
      assert.throws(() => LuckyStarAchievementCompiler.compile(null), TypeError);
      assert.throws(() => LuckyStarAchievementCompiler.compile({}), TypeError);
      assert.throws(() => LuckyStarAchievementCompiler.compile(ls_object_1), TypeError);
    });
    it('should throw RangeError', function() {
      const ls_object_1 = { 'rank': 'XXX', 'payout': -1, 'lp': 0 };
      const ls_object_2 = { 'rank': 'XXX', 'payout': 0, 'lp': -1 };
      assert.throws(() => LuckyStarAchievementCompiler.compile(ls_object_1), RangeError);
      assert.throws(() => LuckyStarAchievementCompiler.compile(ls_object_2), RangeError);
    });
    it('should compile the target correctly', function () {
      assert.deepEqual(
        LuckyStarAchievementCompiler.compile(
          { 'rank': 'bronze', 'payout': 10000, 'lp': 100 }
        ),
        {
          'name': 'ls_bronze',
          'queue': 'ls',
          'target': 'spin',
          'condition': {
            'payout': { '$gte': 10000 }
          },
          'action': {
            '$push': {
              'mails': {
               'name': 'ls_bronze',
                'lp': 100
              }
            }
          }
        }
      );
    });
  });

});
