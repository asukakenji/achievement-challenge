'use strict';

let LevelCompiler = require('../lib/LevelCompiler');
let assert = require('assert');

describe('LevelCompiler', function () {

  describe('#compile()', function () {
    it('should throw RangeError', function() {
      let lv_object_1 = { 'lv': 0, 'xp': 1 };
      let lv_object_2 = { 'lv': 1, 'xp': 0 };
      assert.throws(() => LevelCompiler.compile(lv_object_1), RangeError);
      assert.throws(() => LevelCompiler.compile(lv_object_2), RangeError);
    });
    it('should compile the target correctly', function () {
      assert.deepEqual(
        LevelCompiler.compile(
          { 'lv': 1, 'xp': 300 }
        ),
        {
          'name': 'lv002',
          'queue': 'lv',
          'target': 'player',
          'condition': {
            'lv': { '$eq': 1 },
            'xp': { '$gte': 300 }
          },
          'action': {
            '$inc': { 'xp': -300 },
            '$set': { 'lv': 2 }
          }
        }
      );
    });
  });

});
