'use strict';

const TriggerCompiler = require('../lib/TriggerCompiler');
const assert = require('assert');

describe('TriggerCompiler', function () {

  describe('#compile() - condition part', function () {
    it('Case: {}', function() {
      const source = {
        'name': 'case-0',
        'queue': 'lv',
        'target': 'player',
        'condition': {},
        'action': {}
      };
      const trigger = TriggerCompiler.compile(source);
      assert.deepStrictEqual(trigger.source.condition, {});
    });



    it('Case: { "$lop": [] }', function() {
      const source = {
        'name': 'case-100',
        'queue': 'lv',
        'target': 'player',
        'condition': {
          '$and': []
        },
        'action': {}
      };
      assert.throws(() => TriggerCompiler.compile(source), TypeError);
    });

    it('Case: { "$lop": [ { ... } ] }', function() {
      const source = {
        'name': 'case-101',
        'queue': 'lv',
        'target': 'player',
        'condition': {
          '$and': [
            { 'lv': { '$gt': 514 } }
          ]
        },
        'action': {}
      };
      const trigger = TriggerCompiler.compile(source);
      assert.deepStrictEqual(trigger.source.condition, {
        'lv': { '$gt': 514 }
      });
    });

    it('Case: { "$lop": [ { ... }, { ... } ] }', function() {
      const source = {
        'name': 'case-10x',
        'queue': 'lv',
        'target': 'player',
        'condition': {
          '$and': [
            { 'lv': { '$gt': 514 } },
            { 'lv': { '$lt': 825 } }
          ]
        },
        'action': {}
      };
      const trigger = TriggerCompiler.compile(source);
      assert.deepStrictEqual(trigger.source.condition, {
        '$and': [
          { 'lv': { '$gt': 514 } },
          { 'lv': { '$lt': 825 } }
        ]
      });
    });



    it('Case: { "name": {} }', function() {
      const source = {
        'name': 'case-1100',
        'queue': 'lv',
        'target': 'player',
        'condition': {
          'lv': {}
        },
        'action': {}
      };
      const trigger = TriggerCompiler.compile(source);
      assert.deepStrictEqual(trigger.source.condition, {
        'lv': { '$eq': {} }
      });
    });

    it('Case: { "name": { "$cop": ... } }', function() {
      const source = {
        'name': 'case-1101',
        'queue': 'lv',
        'target': 'player',
        'condition': {
          'lv': { '$gt': 514 }
        },
        'action': {}
      };
      const trigger = TriggerCompiler.compile(source);
      assert.deepStrictEqual(trigger.source.condition, {
        'lv': { '$gt': 514 }
      });
    });

    it('Case: { "name": { "$cop1": ..., "$cop2": ... } }', function() {
      const source = {
        'name': 'case-110x',
        'queue': 'lv',
        'target': 'player',
        'condition': {
          'lv': { '$gt': 514,  '$lt': 825}
        },
        'action': {}
      };
      const trigger = TriggerCompiler.compile(source);
      assert.deepStrictEqual(trigger.source.condition, {
        '$and': [
          { 'lv': { '$gt': 514 } },
          { 'lv': { '$lt': 825 } }
        ]
      });
    });



    it('Case: { "name": {} }', function() {
      const source = {
        'name': 'case-111-0',
        'queue': 'lv',
        'target': 'player',
        'condition': {
          'lv': {}
        },
        'action': {}
      };
      const trigger = TriggerCompiler.compile(source);
      assert.deepStrictEqual(trigger.source.condition, {
        'lv': { '$eq': {} }
      });
    });

    it('Case: { "name": /* array */ }', function() {
      const source = {
        'name': 'case-111-1',
        'queue': 'lv',
        'target': 'player',
        'condition': {
          'lv': [ 5, 1, 4 ]
        },
        'action': {}
      };
      const trigger = TriggerCompiler.compile(source);
      assert.deepStrictEqual(trigger.source.condition, {
        'lv': { '$eq': [ 5, 1, 4 ] }
      });
    });

    it('Case: { "name": /* string */ }', function() {
      const source = {
        'name': 'case-111-2',
        'queue': 'lv',
        'target': 'player',
        'condition': {
          'lv': 'kenji'
        },
        'action': {}
      };
      const trigger = TriggerCompiler.compile(source);
      assert.deepStrictEqual(trigger.source.condition, {
        'lv': { '$eq': 'kenji' }
      });
    });

    it('Case: { "name": /* number */ }', function() {
      const source = {
        'name': 'case-111-3',
        'queue': 'lv',
        'target': 'player',
        'condition': {
          'lv': 514
        },
        'action': {}
      };
      const trigger = TriggerCompiler.compile(source);
      assert.deepStrictEqual(trigger.source.condition, {
        'lv': { '$eq': 514 }
      });
    });

    it('Case: { "name": /* boolean */ }', function() {
      const source = {
        'name': 'case-111-4',
        'queue': 'lv',
        'target': 'player',
        'condition': {
          'lv': true
        },
        'action': {}
      };
      const trigger = TriggerCompiler.compile(source);
      assert.deepStrictEqual(trigger.source.condition, {
        'lv': { '$eq': true }
      });
    });

    it('Case: { "name": null }', function() {
      const source = {
        'name': 'case-111-5',
        'queue': 'lv',
        'target': 'player',
        'condition': {
          'lv': null
        },
        'action': {}
      };
      const trigger = TriggerCompiler.compile(source);
      assert.deepStrictEqual(trigger.source.condition, {
        'lv': { '$eq': null }
      });
    });



    it('Case: { "$lop1": ..., "$lop2": ... }', function() {
      const source = {
        'name': 'case-x-0',
        'queue': 'lv',
        'target': 'player',
        'condition': {
          '$or': [
            { 'lv': { '$gte': 14, '$lte': 25 } },
            { 'lv': { '$gt': 514, '$lt': 825 } }
          ],
          '$and': [
            { 'xp': { '$gte': 514, '$lte': 825 } },
            { 'chips': { '$gt': 1000, '$lt': 10000 } }
          ]
        },
        'action': {}
      };
      const trigger = TriggerCompiler.compile(source);
      assert.deepStrictEqual(trigger.source.condition,
        { '$and': [
          { '$or': [
            { '$and': [
              { 'lv': { '$gte': 14 } },
              { 'lv': { '$lte': 25 } }
            ] },
            { '$and': [
              { 'lv': { '$gt': 514 } },
              { 'lv': { '$lt': 825 } }
            ] }
          ] },
          { '$and': [
            { '$and': [
              { 'xp': { '$gte': 514 } },
              { 'xp': { '$lte': 825 } }
            ] },
            { '$and': [
              { 'chips': { '$gt': 1000 } },
              { 'chips': { '$lt': 10000 } }
            ] }
          ] }
        ] }
      );
    });

    it('Case: { "$lop": ..., "name": ... }', function() {
      const source = {
        'name': 'case-x-1',
        'queue': 'lv',
        'target': 'player',
        'condition': {
          '$or': [
            { 'lv': { '$gte': 14, '$lte': 25 } },
            { 'lv': { '$gt': 514, '$lt': 825 } }
          ],
          'xp': { '$gte': 514, '$lte': 825 }
        },
        'action': {}
      };
      const trigger = TriggerCompiler.compile(source);
      assert.deepStrictEqual(trigger.source.condition,
        { '$and': [
          { '$or': [
            { '$and': [
              { 'lv': { '$gte': 14 } },
              { 'lv': { '$lte': 25 } }
            ] },
            { '$and': [
              { 'lv': { '$gt': 514 } },
              { 'lv': { '$lt': 825 } }
            ] }
          ] },
          { '$and': [
            { 'xp': { '$gte': 514 } },
            { 'xp': { '$lte': 825 } }
          ] }
        ] }
      );
    });

    it('Case: { "name1": ..., "name2": ... }', function() {
      const source = {
        'name': 'case-x-2',
        'queue': 'lv',
        'target': 'player',
        'condition': {
          'lv': { '$gte': 14, '$lte': 25 },
          'xp': { '$gte': 514, '$lte': 825 }
        },
        'action': {}
      };
      const trigger = TriggerCompiler.compile(source);
      assert.deepStrictEqual(trigger.source.condition,
        { '$and': [
          { '$and': [
            { 'lv': { '$gte': 14 } },
            { 'lv': { '$lte': 25 } }
          ] },
          { '$and': [
            { 'xp': { '$gte': 514 } },
            { 'xp': { '$lte': 825 } }
          ] }
        ] }
      );
    });
  });



  describe('#compile() - action part', function () {
    it('Case: {}', function() {
      const source = {
        'name': 'case-0',
        'queue': 'lv',
        'target': 'player',
        'condition': {},
        'action': {}
      };
      const trigger = TriggerCompiler.compile(source);
      assert.deepStrictEqual(trigger.source.action, []);
    });

    it('Case: { "$uop": {} }', function() {
      const source = {
        'name': 'case-1',
        'queue': 'lv',
        'target': 'player',
        'condition': {},
        'action': {
          '$inc': {}
        }
      };
      const trigger = TriggerCompiler.compile(source);
      // TODO: Should throw error
      assert.deepStrictEqual(trigger.source.action, []);
    });

    it('Case: { "$uop": { "name": "value" } }', function() {
      const source = {
        'name': 'case-2',
        'queue': 'lv',
        'target': 'player',
        'condition': {},
        'action': {
          '$inc': {
            'xp': 100
          }
        }
      };
      const trigger = TriggerCompiler.compile(source);
      assert.deepStrictEqual(trigger.source.action, [
        { '$inc': { 'xp': 100 } }
      ]);
    });

    it('Case: { "$uop": { "name1": "value1", "name2": "value2" } }', function() {
      const source = {
        'name': 'case-3',
        'queue': 'lv',
        'target': 'player',
        'condition': {},
        'action': {
          '$inc': {
            'xp': 100,
            'chips': 200
          }
        }
      };
      const trigger = TriggerCompiler.compile(source);
      assert.deepStrictEqual(trigger.source.action, [
        { '$inc': { 'xp': 100 } },
        { '$inc': { 'chips': 200 } }
      ]);
    });

    it('Case: { "$uop1": { "name1": "value1" }, "$uop2": { "name2": "value2" } }', function() {
      const source = {
        'name': 'case-4',
        'queue': 'lv',
        'target': 'player',
        'condition': {},
        'action': {
          '$inc': {
            'xp': -300
          },
          '$set': {
            'lv': 2
          }
        }
      };
      const trigger = TriggerCompiler.compile(source);
      assert.deepStrictEqual(trigger.source.action, [
        { '$inc': { 'xp': -300 } },
        { '$set': { 'lv': 2 } }
      ]);
    });

    it('Case: { "$uop1": { "name1": "value1", "name2": "value2" }, "$uop2": { "name3": "value3", "name4": "value4" } }', function() {
      const source = {
        'name': 'case-5',
        'queue': 'lv',
        'target': 'player',
        'condition': {},
        'action': {
          '$inc': {
            'xp': -300,
            'chips': 1000
          },
          '$set': {
            'lv': 2,
            'lp': 500
          }
        }
      };
      const trigger = TriggerCompiler.compile(source);
      assert.deepStrictEqual(trigger.source.action, [
        { '$inc': { 'xp': -300 } },
        { '$inc': { 'chips': 1000 } },
        { '$set': { 'lv': 2 } },
        { '$set': { 'lp': 500 } }
      ]);
    });
  });



  describe('#compile() - both parts', function () {
    it('#99', function() {
      const source = {
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
      const trigger = TriggerCompiler.compile(source);
      assert.deepStrictEqual(trigger.source.condition,
        {
          '$and': [
            { 'lv': { '$eq': 1 } },
            { 'xp': { '$gte': 300 } }
          ]
        }
      );
      const player = {
        'lv': 1,
        'xp': 300
      };
      assert(trigger.function(player));
      assert.strictEqual(player.lv, 2);
      assert.strictEqual(player.xp, 0);
    });
  });

});
