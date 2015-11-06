'use strict';

const HighRollerAchievementCompiler = require('../lib/HighRollerAchievementCompiler');
const assert = require('assert');

describe('HighRollerAchievementCompiler', function () {

  describe('#compile()', function () {
    it('should throw TypeError', function() {
      const hr_object_1 = { 'rank': '', 'wager': 0, 'xp': 0, 'bonus': 0  };
      assert.throws(() => HighRollerAchievementCompiler.compile(), TypeError);
      assert.throws(() => HighRollerAchievementCompiler.compile(null), TypeError);
      assert.throws(() => HighRollerAchievementCompiler.compile({}), TypeError);
      assert.throws(() => HighRollerAchievementCompiler.compile(hr_object_1), TypeError);
    });
    it('should throw RangeError', function() {
      const hr_object_1 = { 'rank': 'XXX', 'wager': -1, 'xp': 0, 'bonus': 0 };
      const hr_object_2 = { 'rank': 'XXX', 'wager': 0, 'xp': -1, 'bonus': 0 };
      const hr_object_3 = { 'rank': 'XXX', 'wager': 0, 'xp': 0, 'bonus': -1 };
      assert.throws(() => HighRollerAchievementCompiler.compile(hr_object_1), RangeError);
      assert.throws(() => HighRollerAchievementCompiler.compile(hr_object_2), RangeError);
      assert.throws(() => HighRollerAchievementCompiler.compile(hr_object_3), RangeError);
    });
    it('should compile the target correctly', function () {
      assert.deepStrictEqual(
        HighRollerAchievementCompiler.compile(
          { 'rank': 'bronze', 'wager': 100, 'xp': 500, 'bonus': 100 }
        ),
        {
          'name': 'hr_bronze',
          'queue': 'hr',
          'target': 'spin',
          'condition': {
            'wager': { '$gte': 100 }
          },
          'action': {
            '$push': {
              'mails': {
                'name': 'hr_bronze',
                'xp': 500,
                'bonus': 100
              }
            }
          }
        }
      );
    });
  });

});
