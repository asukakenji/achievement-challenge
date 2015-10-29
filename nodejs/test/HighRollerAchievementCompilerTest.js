'use strict';

let HighRollerAchievementCompiler = require('../lib/HighRollerAchievementCompiler');
let assert = require('assert');

describe('HighRollerAchievementCompiler', function () {

  describe('#compile()', function () {
    it('should throw TypeError', function() {
      let hr_object_1 = { 'rank': '', 'wager': 0, 'bonus': 0, 'xp': 0 };
      assert.throws(() => HighRollerAchievementCompiler.compile(), TypeError);
      assert.throws(() => HighRollerAchievementCompiler.compile(null), TypeError);
      assert.throws(() => HighRollerAchievementCompiler.compile({}), TypeError);
      assert.throws(() => HighRollerAchievementCompiler.compile(hr_object_1), TypeError);
    });
    it('should throw RangeError', function() {
      let hr_object_1 = { 'rank': 'XXX', 'wager': -1, 'bonus': 0, 'xp': 0 };
      let hr_object_2 = { 'rank': 'XXX', 'wager': 0, 'bonus': -1, 'xp': 0 };
      let hr_object_3 = { 'rank': 'XXX', 'wager': 0, 'bonus': 0, 'xp': -1 };
      assert.throws(() => HighRollerAchievementCompiler.compile(hr_object_1), RangeError);
      assert.throws(() => HighRollerAchievementCompiler.compile(hr_object_2), RangeError);
      assert.throws(() => HighRollerAchievementCompiler.compile(hr_object_3), RangeError);
    });
    it('should compile the target correctly', function () {
      assert.deepEqual(
        HighRollerAchievementCompiler.compile(
          { 'rank': 'bronze', 'wager': 100, 'bonus': 100, 'xp': 500 }
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
                'bonus': 100,
                'xp': 500
              }
            }
          }
        }
      );
    });
  });

});
