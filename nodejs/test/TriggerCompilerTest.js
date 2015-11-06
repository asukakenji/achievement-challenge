'use strict';

const TriggerCompiler = require('../lib/TriggerCompiler');
const assert = require('assert');

describe('TriggerCompiler', function () {

  describe('#compile()', function () {
    it('#1', function() {
      let source = {
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
      };
      let trigger = TriggerCompiler.compile(source);
      assert.deepStrictEqual(trigger.source.condition,
        {
          'lv': { '$eq': 1 },
          'xp': { '$gte': 300 }
        }
      );
      let player = {
        'lv': 1,
        'xp': 300
      };
      assert(trigger.function(player));
      assert.strictEqual(player.lv, 2);
      assert.strictEqual(player.xp, 0);
    });
  });

});
