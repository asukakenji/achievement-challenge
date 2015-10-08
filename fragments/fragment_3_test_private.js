"use strict";

let assert = require("assert");
let f3 = require("./fragment_3");

f3.test_private(
	function(
		_canonicalize_sub_field,
		_canonicalize_sub_or_value,
		_canonicalize_tree_list,
		_canonicalize_match_expression_element,
		_canonicalize
	) {

// _canonicalize_sub_field
// -----------------------
assert.throws(() => _canonicalize_sub_field("x", "$eq", {}, []), /Embedded documents/);
assert.deepStrictEqual(_canonicalize_sub_field("x", "$eq", [0], []), [ { "x": { "$eq": [0] } } ]);
assert.deepStrictEqual(_canonicalize_sub_field("x", "$eq", "0", []), [ { "x": { "$eq": "0" } } ]);
assert.deepStrictEqual(_canonicalize_sub_field("x", "$eq", 0, []), [ { "x": { "$eq": 0 } } ]);
assert.deepStrictEqual(_canonicalize_sub_field("x", "$eq", false, []), [ { "x": { "$eq": false } } ]);
assert.deepStrictEqual(_canonicalize_sub_field("x", "$eq", null, []), [ { "x": { "$eq": null } } ]);
// --------
assert.throws(() => _canonicalize_sub_field(0, "$eq", 0, []), /name/);
assert.throws(() => _canonicalize_sub_field("$x", "$eq", 0, []), /name/);
assert.throws(() => _canonicalize_sub_field("x", 0, 0, []), /comparison_operator/);
assert.throws(() => _canonicalize_sub_field("x", "eq", 0, []), /comparison_operator/);
assert.throws(() => _canonicalize_sub_field("x", "$eq", undefined, []), /value/);
assert.throws(() => _canonicalize_sub_field("x", "$eq", Symbol("x"), []), /value/);
assert.throws(() => _canonicalize_sub_field("x", "$eq", function(){}, []), /value/);
assert.throws(() => _canonicalize_sub_field("x", "$eq", 0, undefined), /root/);
assert.throws(() => _canonicalize_sub_field("x", "$eq", 0, null), /root/);
assert.throws(() => _canonicalize_sub_field("x", "$eq", 0, {}), /root/);

// _canonicalize_sub_or_value
// --------------------------
assert.throws(() => _canonicalize_sub_or_value("x", {}, "$and", []), /Embedded documents/);
assert.deepStrictEqual(_canonicalize_sub_or_value("x", [0], "$and", []), [ { "x": { "$eq": [0] } } ]);
assert.deepStrictEqual(_canonicalize_sub_or_value("x", "0", "$and", []), [ { "x": { "$eq": "0" } } ]);
assert.deepStrictEqual(_canonicalize_sub_or_value("x", 0, "$and", []), [ { "x": { "$eq": 0 } } ]);
assert.deepStrictEqual(_canonicalize_sub_or_value("x", false, "$and", []), [ { "x": { "$eq": false } } ]);
assert.deepStrictEqual(_canonicalize_sub_or_value("x", null, "$and", []), [ { "x": { "$eq": null } } ]);
// --------
assert.throws(() => _canonicalize_sub_or_value("x", { "$eq": {} }, "$and", []), /Embedded documents/);
assert.deepStrictEqual(_canonicalize_sub_or_value("x", { "$eq": [0] }, "$and", []), [ { "x": { "$eq": [0] } } ]);
assert.deepStrictEqual(_canonicalize_sub_or_value("x", { "$eq": "0" }, "$and", []), [ { "x": { "$eq": "0" } } ]);
assert.deepStrictEqual(_canonicalize_sub_or_value("x", { "$eq": 0 }, "$and", []), [ { "x": { "$eq": 0 } } ]);
assert.deepStrictEqual(_canonicalize_sub_or_value("x", { "$eq": false }, "$and", []), [ { "x": { "$eq": false } } ]);
assert.deepStrictEqual(_canonicalize_sub_or_value("x", { "$eq": null }, "$and", []), [ { "x": { "$eq": null } } ]);
// --------
assert.throws(() => _canonicalize_sub_or_value("x", {}, "$and", []), /Embedded documents/);
assert.deepStrictEqual(_canonicalize_sub_or_value("x", [0], "$or", []), [ { "x": { "$eq": [0] } } ]);
assert.deepStrictEqual(_canonicalize_sub_or_value("x", "0", "$or", []), [ { "x": { "$eq": "0" } } ]);
assert.deepStrictEqual(_canonicalize_sub_or_value("x", 0, "$or", []), [ { "x": { "$eq": 0 } } ]);
assert.deepStrictEqual(_canonicalize_sub_or_value("x", false, "$or", []), [ { "x": { "$eq": false } } ]);
assert.deepStrictEqual(_canonicalize_sub_or_value("x", null, "$or", []), [ { "x": { "$eq": null } } ]);
// --------
assert.throws(() => _canonicalize_sub_or_value("x", { "$eq": {} }, "$or", []), /Embedded documents/);
assert.deepStrictEqual(_canonicalize_sub_or_value("x", { "$eq": [0] }, "$or", []), [ { "x": { "$eq": [0] } } ]);
assert.deepStrictEqual(_canonicalize_sub_or_value("x", { "$eq": "0" }, "$or", []), [ { "x": { "$eq": "0" } } ]);
assert.deepStrictEqual(_canonicalize_sub_or_value("x", { "$eq": 0 }, "$or", []), [ { "x": { "$eq": 0 } } ]);
assert.deepStrictEqual(_canonicalize_sub_or_value("x", { "$eq": false }, "$or", []), [ { "x": { "$eq": false } } ]);
assert.deepStrictEqual(_canonicalize_sub_or_value("x", { "$eq": null }, "$or", []), [ { "x": { "$eq": null } } ]);
// --------
assert.deepStrictEqual(_canonicalize_sub_or_value("x", { "$gt": 2, "$lt": 3 }, "$and", []), [ { "x": { "$gt": 2 } }, { "x": { "$lt": 3 } } ]);
assert.deepStrictEqual(_canonicalize_sub_or_value("x", { "$gt": 2, "$lt": 3 }, "$or", []), [ { "$and": [ { "x": { "$gt": 2 } }, { "x": { "$lt": 3 } } ] } ]);
// --------
// TODO: Sanity check cases

	}
);
