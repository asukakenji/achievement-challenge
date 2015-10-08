"use strict";

let assert = require("assert");
let f3 = require("./fragment_3");
let canonicalize = f3.canonicalize;

// canonicalize
// ------------
assert.deepStrictEqual(canonicalize({}), {});
// --------
assert.throws(() => canonicalize({ "x": {} }), /Embedded documents/);
assert.deepStrictEqual(canonicalize({ "x": [0] }), { "x": { "$eq": [0] } });
assert.deepStrictEqual(canonicalize({ "x": "0" }), { "x": { "$eq": "0" } });
assert.deepStrictEqual(canonicalize({ "x": 0 }), { "x": { "$eq": 0 } });
assert.deepStrictEqual(canonicalize({ "x": false }), { "x": { "$eq": false } });
assert.deepStrictEqual(canonicalize({ "x": null }), { "x": { "$eq": null } });
// --------
assert.deepStrictEqual(canonicalize({ "x": { "$eq": 0 } }), { "x": { "$eq": 0 } });
assert.deepStrictEqual(canonicalize({ "x": { "$gt": 2, "$lt": 3 } }), { "$and": [ { "x": { "$gt": 2 } }, { "x": { "$lt": 3 } } ] });
assert.deepStrictEqual(canonicalize({ "x": 0, "y": 1 }), { "$and": [ { "x": { "$eq": 0 } }, { "y": { "$eq": 1 } } ] });
assert.deepStrictEqual(canonicalize({ "x": { "$eq": 0 }, "y": { "$eq": 1 } }), { "$and": [ { "x": { "$eq": 0 } }, { "y": { "$eq": 1 } } ] });
assert.deepStrictEqual(canonicalize({ "x": { "$gt": 2, "$lt": 3 } }), { "$and": [ { "x": { "$gt": 2 } }, { "x": { "$lt": 3 } } ] });
assert.deepStrictEqual(canonicalize({ "x": { "$gt": 2, "$lt": 3 }, "y": { "$gt": 4, "$lt": 5 } }), { "$and": [ { "x": { "$gt": 2 } }, { "x": { "$lt": 3 } }, { "y": { "$gt": 4 } }, { "y": { "$lt": 5 } } ] });
// --------
assert.deepStrictEqual(canonicalize({ "$and": [ {} ] }), {});
assert.throws(() => canonicalize({ "$and": [ { "x": {} } ] }), /Embedded documents/);
assert.deepStrictEqual(canonicalize({ "$and": [ { "x": 0 } ] }), { "x": { "$eq": 0 } });
assert.deepStrictEqual(canonicalize({ "$and": [ { "x": { "$eq": 0 } } ] }), { "x": { "$eq": 0 } });
assert.deepStrictEqual(canonicalize({ "$and": [ { "x": { "$gt": 2, "$lt": 3 } } ] }), { "$and": [ { "x": { "$gt": 2 } }, { "x": { "$lt": 3 } } ] });
assert.deepStrictEqual(canonicalize({ "$and": [ { "x": 0, "y": 1 } ] }), { "$and": [ { "x": { "$eq": 0 } }, { "y": { "$eq": 1 } } ] });
assert.deepStrictEqual(canonicalize({ "$and": [ { "x": { "$eq": 0 }, "y": { "$eq": 1 } } ] }), { "$and": [ { "x": { "$eq": 0 } }, { "y": { "$eq": 1 } } ] });
assert.deepStrictEqual(canonicalize({ "$and": [ { "x": { "$gt": 2, "$lt": 3 } } ] }), { "$and": [ { "x": { "$gt": 2 } }, { "x": { "$lt": 3 } } ] });
assert.deepStrictEqual(canonicalize({ "$and": [ { "x": { "$gt": 2, "$lt": 3 }, "y": { "$gt": 4, "$lt": 5 } } ] }), { "$and": [ { "x": { "$gt": 2 } }, { "x": { "$lt": 3 } }, { "y": { "$gt": 4 } }, { "y": { "$lt": 5 } } ] });
// --------
assert.deepStrictEqual(canonicalize({ "$or": [ {} ] }), {});
assert.throws(() => canonicalize({ "$or": [ { "x": {} } ] }), /Embedded documents/);
assert.deepStrictEqual(canonicalize({ "$or": [ { "x": 0 } ] }), { "x": { "$eq": 0 } });
assert.deepStrictEqual(canonicalize({ "$or": [ { "x": { "$eq": 0 } } ] }), { "x": { "$eq": 0 } });
assert.deepStrictEqual(canonicalize({ "$or": [ { "x": { "$gt": 2, "$lt": 3 } } ] }), { "$and": [ { "x": { "$gt": 2 } }, { "x": { "$lt": 3 } } ] });
assert.deepStrictEqual(canonicalize({ "$or": [ { "x": 0, "y": 1 } ] }), { "$and": [ { "x": { "$eq": 0 } }, { "y": { "$eq": 1 } } ] });
assert.deepStrictEqual(canonicalize({ "$or": [ { "x": { "$eq": 0 }, "y": { "$eq": 1 } } ] }), { "$and": [ { "x": { "$eq": 0 } }, { "y": { "$eq": 1 } } ] });
assert.deepStrictEqual(canonicalize({ "$or": [ { "x": { "$gt": 2, "$lt": 3 } } ] }), { "$and": [ { "x": { "$gt": 2 } }, { "x": { "$lt": 3 } } ] });
assert.deepStrictEqual(canonicalize({ "$or": [ { "x": { "$gt": 2, "$lt": 3 }, "y": { "$gt": 4, "$lt": 5 } } ] }), { "$and": [ { "x": { "$gt": 2 } }, { "x": { "$lt": 3 } }, { "y": { "$gt": 4 } }, { "y": { "$lt": 5 } } ] });
// --------
assert.deepStrictEqual(canonicalize(
	{ "$and": [
		{},
		{ "x": 0 }
	] }
),
	{ "x": { "$eq": 0 } }
);
assert.deepStrictEqual(canonicalize(
	{ "$and": [
		{ "x": 0 },
		{ "y": 1 }
	] }
),
	{ "$and": [
		{ "x": { "$eq": 0 } },
		{ "y": { "$eq": 1 } }
	] }
);
assert.deepStrictEqual(canonicalize(
	{ "$and": [
		{},
		{ "x": { "$gt": 2, "$lt": 3 } }
	] }
),
	{ "$and": [
		{ "x": { "$gt": 2 } },
		{ "x": { "$lt": 3 } }
	] }
);
assert.deepStrictEqual(canonicalize(
	{ "$and": [
		{ "x": { "$gt": 2, "$lt": 3 } },
		{ "y": { "$gt": 4, "$lt": 5 } }
	] }
),
	{ "$and": [
		{ "x": { "$gt": 2 } },
		{ "x": { "$lt": 3 } },
		{ "y": { "$gt": 4 } },
		{ "y": { "$lt": 5 } }
	] }
);
assert.deepStrictEqual(canonicalize(
	{ "$or": [
		{},
		{ "x": 0 },
	] }
),
	{ "$or": [
		{},
		{ "x": { "$eq": 0 } }
	] }
);
assert.deepStrictEqual(canonicalize(
	{ "$or": [
		{ "x": 0 },
		{ "y": 1 }
	] }
),
	{ "$or": [
		{ "x": { "$eq": 0 } },
		{ "y": { "$eq": 1 } }
	] }
);
assert.deepStrictEqual(canonicalize(
	{ "$or": [
		{},
		{ "x": { "$gt": 2, "$lt": 3 } }
	] }
),
	{ "$or": [
		{},
		{ "$and": [
			{ "x": { "$gt": 2 } },
			{ "x": { "$lt": 3 } }
		] }
	] }
);
assert.deepStrictEqual(canonicalize(
	{ "$or": [
		{ "x": { "$gt": 2, "$lt": 3 } },
		{ "y": { "$gt": 4, "$lt": 5 } }
	] }
),
	{ "$or": [
		{ "$and": [
			{ "x": { "$gt": 2 } },
			{ "x": { "$lt": 3 } }
		] },
		{ "$and": [
			{ "y": { "$gt": 4 } },
			{ "y": { "$lt": 5 } }
		] }
	] }
);
// --------
// console.log(JSON.stringify(canonicalize(
// 	{
// 		"x": 1,
// 		"y": { "$eq" : 2 },
// 		"z": { "$gt": 3, "$lt": 4 },
// 		"$and": [
// 			{ "a": 1 },
// 			{ "b": { "$eq": 2 } },
// 			{ "c": { "$gt": 3, "$lt": 4 } },
// 			{ "$and": [
// 				{ "d": 5 },
// 				{ "e": 6 }
// 			] },
// 			{ "$or": [
// 				{ "f": 7 },
// 				{ "g": 8 }
// 			] },
// 			{ "$and": [
// 				{ "h1": 9 }
// 			] },
// 			{ "$or": [
// 				{ "h2": 10 }
// 			] }
// 		],
// 		"$or": [
// 			{ "i": 1 },
// 			{ "j": { "$eq": 2 } },
// 			{ "k": { "$gt": 3, "$lt": 4 } },
// 			{ "$and": [
// 				{ "m": 5 },
// 				{ "n": 6 }
// 			] },
// 			{ "$or": [
// 				{ "p": 7 },
// 				{ "q": 8 }
// 			] },
// 			{ "$and": [ { "r1": 9 } ] },
// 			{ "$or": [ { "r2": 10 } ] }
// 		]
// 	}
// ), null, 4));
// console.log("--------");
// console.log(JSON.stringify(
// 	{ "$and": [
// 		{ "x": { "$eq": 1 } },
// 		{ "y": { "$eq": 2 } },
// 		{ "z": { "$gt": 3 } },
// 		{ "z": { "$lt": 4 } },
// 		{ "a": { "$eq": 1 } },
// 		{ "b": { "$eq": 2 } },
// 		{ "c": { "$gt": 3 } },
// 		{ "c": { "$lt": 4 } },
// 		{ "d": { "$eq": 5 } },
// 		{ "e": { "$eq": 6 } },
// 		{ "$or": [
// 			{ "f": { "$eq": 7 } },
// 			{ "g": { "$eq": 8 } }
// 		] },
// 		{ "h1": { "$eq": 9 } },
// 		{ "h2": { "$eq": 10 } },
// 		{ "$or": [
// 			{ "i": { "$eq": 1 } },
// 			{ "j": { "$eq": 2 } },
// 			{ "$and": [
// 				{ "k": { "$gt": 3 } },
// 				{ "k": { "$lt": 4 } }
// 			] },
// 			{ "$and": [
// 				{ "m": { "$eq": 5 } },
// 				{ "n": { "$eq": 6 } }
// 			] },
// 			{ "p": { "$eq": 7 } },
// 			{ "q": { "$eq": 8 } },
// 			{ "r1": { "$eq": 9 } },
// 			{ "r2": { "$eq": 10 } }
// 		] }
// 	] }, null, 4));
// assert.deepStrictEqual(canonicalize(
// 	{
// 		"x": 1,
// 		"y": { "$eq" : 2 },
// 		"z": { "$gt": 3, "$lt": 4 },
// 		"$and": [
// 			{ "a": 1 },
// 			{ "b": { "$eq": 2 } },
// 			{ "c": { "$gt": 3, "$lt": 4 } },
// 			{ "$and": [
// 				{ "d": 5 },
// 				{ "e": 6 }
// 			] },
// 			{ "$or": [
// 				{ "f": 7 },
// 				{ "g": 8 }
// 			] },
// 			{ "$and": [
// 				{ "h1": 9 }
// 			] },
// 			{ "$or": [
// 				{ "h2": 10 }
// 			] }
// 		],
// 		"$or": [
// 			{ "i": 1 },
// 			{ "j": { "$eq": 2 } },
// 			{ "k": { "$gt": 3, "$lt": 4 } },
// 			{ "$and": [
// 				{ "m": 5 },
// 				{ "n": 6 }
// 			] },
// 			{ "$or": [
// 				{ "p": 7 },
// 				{ "q": 8 }
// 			] },
// 			{ "$and": [ { "r1": 9 } ] },
// 			{ "$or": [ { "r2": 10 } ] }
// 		]
// 	}
// ),
// 	{ "$and": [
// 		{ "x": { "$eq": 1 } },
// 		{ "y": { "$eq": 2 } },
// 		{ "z": { "$gt": 3 } },
// 		{ "z": { "$lt": 4 } },
// 		{ "a": { "$eq": 1 } },
// 		{ "b": { "$eq": 2 } },
// 		{ "c": { "$gt": 3 } },
// 		{ "c": { "$lt": 4 } },
// 		{ "d": { "$eq": 5 } },
// 		{ "e": { "$eq": 6 } },
// 		{ "$or": [
// 			{ "f": { "$eq": 7 } },
// 			{ "g": { "$eq": 8 } }
// 		] },
// 		{ "h1": 9 },
// 		{ "h2": 10 },
// 		{ "$or": [
// 			{ "i": { "$eq": 1 } },
// 			{ "j": { "$eq": 2 } },
// 			{ "$and": [
// 				{ "k": { "$gt": 3 } },
// 				{ "k": { "$lt": 4 } }
// 			] },
// 			{ "$and": [
// 				{ "m": { "$eq": 5 } },
// 				{ "m": { "$eq": 6 } }
// 			] },
// 			{ "p": { "$eq": 7 } },
// 			{ "q": { "$eq": 8 } },
// 			{ "r1": { "$eq": 9 } },
// 			{ "r2": { "$eq": 10 } }
// 		] }
// 	] }
// );
