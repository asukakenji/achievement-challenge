'use strict';

const PerennialChampionAchievementCompiler = require('../lib/PerennialChampionAchievementCompiler');
const assert = require('assert');

describe('PerennialChampionAchievementCompiler', function () {

  describe('#compile()', function () {
    it('should throw TypeError', function() {
      const pc_object_1 = { 'rank': '', 'payoutAccumulated': 0, 'xp': 0 };
      assert.throws(() => PerennialChampionAchievementCompiler.compile(), TypeError);
      assert.throws(() => PerennialChampionAchievementCompiler.compile(null), TypeError);
      assert.throws(() => PerennialChampionAchievementCompiler.compile({}), TypeError);
      assert.throws(() => PerennialChampionAchievementCompiler.compile(pc_object_1), TypeError);
    });
    it('should throw RangeError', function() {
      const pc_object_1 = { 'rank': 'XXX', 'payoutAccumulated': -1, 'xp': 0 };
      const pc_object_2 = { 'rank': 'XXX', 'payoutAccumulated': 0, 'xp': -1 };
      assert.throws(() => PerennialChampionAchievementCompiler.compile(pc_object_1), RangeError);
      assert.throws(() => PerennialChampionAchievementCompiler.compile(pc_object_2), RangeError);
    });
    it('should compile the target correctly', function () {
      assert.deepEqual(
        PerennialChampionAchievementCompiler.compile(
          { 'rank': 'bronze', 'payoutAccumulated': 10000, 'xp': 1000 }
        ),
        {
          'name': 'pc_bronze',
          'queue': 'pc',
          'target': 'player',
          'condition': {
            'payoutAccumulated': { '$gte': 10000 }
          },
          'action': {
            '$push': { 
              'mails': {
                'name': 'pc_bronze',
                'xp': 1000
              }
            }
          }
        }
      );
    });
  });

});
