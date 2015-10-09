"use strict";

let assert = require("assert");
let f4 = require("./fragment_4");
let compile = f4.compile;

// compile
// -------

let mf1 = compile({ "lv": { "$eq": 3 } });
assert.strictEqual(mf1({ "lv": 1 }), false, "mf1-lv1");
assert.strictEqual(mf1({ "lv": 3 }), true, "mf1-lv3");

let mf2 = compile({ "$and": [ { "lv": { "$eq": 3 } }, { "xp": { "$gte": 1000 } } ] });
assert.strictEqual(mf2({ "lv": 1, "xp": 0 }), false, "mf2-lv1-xp0");
assert.strictEqual(mf2({ "lv": 3, "xp": 0 }), false, "mf2-lv3-xp0");
assert.strictEqual(mf2({ "lv": 1, "xp": 1000 }), false, "mf2-lv1-xp1000");
assert.strictEqual(mf2({ "lv": 3, "xp": 5000 }), true, "mf2-lv3-xp5000");

let mf3 = compile({ "$or": [ { "lv": { "$eq": 3 } }, { "xp": { "$gte": 1000 } } ] });
assert.strictEqual(mf3({ "lv": 1, "xp": 0 }), false, "mf3-lv1-xp0");
assert.strictEqual(mf3({ "lv": 3, "xp": 0 }), true, "mf3-lv3-xp0");
assert.strictEqual(mf3({ "lv": 1, "xp": 1000 }), true, "mf3-lv1-xp1000");
assert.strictEqual(mf3({ "lv": 3, "xp": 5000 }), true, "mf3-lv3-xp5000");

assert.throws(() => compile({ "lv": { "$eq": 3 }, "xp": { "$gte": 1000 } }), /canonicalized/);
assert.throws(() => compile({ "$xxx": [ { "lv": { "$eq": 3 } }, { "xp": { "$gte": 1000 } } ] }), /logical_operator/);
assert.throws(() => compile({ "xxx": { "$eq": 3 } }), /player_property/);
assert.throws(() => compile({ "lv": { "$gt": 2, "$lt": 4 } }), /canonicalized/);
assert.throws(() => compile({ "lv": { "$xxx": 3 } }), /comparison_operator/);
