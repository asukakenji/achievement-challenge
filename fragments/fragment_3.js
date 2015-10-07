"use strict";

module.exports = {
	canonicalize: _canonicalize
};

// See: http://www.json.org/
function _is_json_value(value) {
	if (value === undefined) return false;
	if (value === null) return true;
	return ([Object, Array, String, Number, Boolean].indexOf(value.constructor) !== -1);
}

function _is_name(name) {
	return (typeof name === "string")
		&& name.charAt(0) !== "$";
}

function _is_operator(operator) {
	return (typeof operator === "string")
		&& operator.charAt(0) === "$";
}

function _is_object(object) {
	return (object !== undefined)
		&& (object !== null)
		&& (object.constructor === Object);
}

function _is_array(array) {
	return (array !== undefined)
		&& (array !== null)
		&& (array.constructor === Array);
}



function _canonicalize(match_expression) {
	let root = [];
	_canonicalize_match_expression(match_expression, "$and", root);
	switch (root.length) {
		case 0: {
			return {};
		}
		case 1: {
			return root[0];
		}
		default: {
			return { "$and": root };
		}
	}
}



function _canonicalize_match_expression(match_expression, root_operator, root) {
//console.log("_canonicalize_match_expression(" + JSON.stringify(match_expression) + ", " + JSON.stringify(root_operator) + ", " + JSON.stringify(root) + ")");
//console.log();
	if (!_is_object(match_expression)) {
		throw new Error("Invalid match_expression: " + match_expression);
	}
	if (!_is_operator(root_operator)) {
		throw new Error("Invalid root_operator: " + root_operator);
	}
	if (!_is_array(root)) {
		throw new Error("Invalid root: " + root);
	}
	let field_names = Object.keys(match_expression);
	let temp_root = (root_operator === "$and" ? root : []);
	// Case: { "x": ... }
	// Case: { "x": ..., "y": ... }
	// Case: { "$and": ... }
	// Case: { "$and": ..., "$or": ... }
	for (let field_name of field_names) {
		let object = match_expression[field_name];
		// Case: { "x": ... }
		// Case: { "y": ... }
		// Case: { "$and": ... }
		// Case: { "$or": ... }
		_canonicalize_match_expression_element(field_name, object, "$and", temp_root);
	}
	if (root_operator !== "$and") {
		switch (temp_root.length) {
			case 0: {
				// Case: {}
				root.push({});
				break;
			}
			case 1: {
				// Case: { "x": "value" }
				// Case: { "x": { "$op": "value" } }
				root.push(temp_root[0]);
				break;
			}
			default: {
				// Case: { "x": { "$op1": "value1", "$op2": "value2" } }
				// Case: { "x": ..., "y": ... }
				// Case: { "$and": ... }
				// Case: { "$and": ..., "$or": ... }
				root.push( { "$and": temp_root } );
			}
		}
	}
	return root;
}



function _canonicalize_match_expression_element(field_name, object, root_operator, root) {
//console.log("_canonicalize_match_expression_element(" + JSON.stringify(field_name) + ", " + JSON.stringify(object) + ", " + JSON.stringify(root_operator) + ", " + JSON.stringify(root) + ")");
//console.log();
	if (!_is_operator(root_operator)) {
		throw new Error("Invalid root_operator: " + root_operator);
	}
	if (!_is_array(root)) {
		throw new Error("Invalid root: " + root);
	}
	if (field_name.charAt(0) === "$") {
		// Case: { "$and": ... }
		// Case: { "$or": ... }
		_canonicalize_tree_list(field_name, object, root_operator, root);
	} else {
		// Case: { "x": 0 }
		// Case: { "x": { "$eq": 0 } }
		// Case: { "x": { "$gt": 2, "$lt": 3 } }
		// Case: { "x": 0, "y": 1 }
		// Case: { "x": { "$eq": 0 }, "y": { "$eq": 1 } }
		// Case: { "x": { "$gt": 2, "$lt": 3 }, "y": { "$gt": 4, "$lt": 5 } }
		_canonicalize_sub_or_value(field_name, object, root_operator, root);
	}
	return root;
}



function _canonicalize_tree_list(logical_operator, operands, root_operator, root) {
//console.log("_canonicalize_tree_list(" + JSON.stringify(logical_operator) + ", " + JSON.stringify(operands) + ", " + JSON.stringify(root_operator) + ", " + JSON.stringify(root) + ")");
//console.log();
	if (!_is_operator(logical_operator)) {
		throw new Error("Invalid logical_operator: " + logical_operator);
	}
	if (!_is_array(operands)) {
		throw new Error("Invalid operands: " + operands);
	}
	if (!_is_operator(root_operator)) {
		throw new Error("Invalid root_operator: " + root_operator);
	}
	if (!_is_array(root)) {
		throw new Error("Invalid root: " + root);
	}
	let temp_root = (logical_operator === root_operator ? root : []);
	// Case: { "$and": [ ... ] }
	// Case: { "$or": [ ... ] }
	for (let operand of operands) {
		_canonicalize_match_expression(operand, logical_operator, temp_root);
	}
	if (logical_operator !== root_operator) {
		switch (temp_root.length) {
			case 0: {
				// Do nothing
				break;
			}
			case 1: {
				root.push(temp_root[0]);
				break;
			}
			default: {
				root.push( { [logical_operator]: temp_root } );
			}
		}
	}
	return root;
}



function _canonicalize_sub_or_value(name, sub_or_value, root_operator, root) {
	if (!_is_name(name)) {
		throw new Error("Invalid name: " + name);
	}
	if (!_is_json_value(sub_or_value)) {
		throw new Error("Invalid sub_or_value: " + sub_or_value);
	}
	if (!_is_operator(root_operator)) {
		throw new Error("Invalid root_operator: " + root_operator);
	}
	if (!_is_array(root)) {
		throw new Error("Invalid root: " + root);
	}
	if (_is_object(sub_or_value)) {
		let sub = sub_or_value;
		let comparison_operators = Object.keys(sub);
		switch (comparison_operators.length) {
			case 0: {
				// Case: { "x": {} }
				// Handled after the switch
				break;
			}
			case 1: {
				// Case: { "x": { "$eq": 0 } }
				let comparison_operator = comparison_operators[0];
				let value = sub[comparison_operator];
				return _canonicalize_sub_field(name, comparison_operator, value, root);
			}
			default: {
				// Case: { "x": { "$gt": 2, "$lt": 3 } }
				let temp_root = (root_operator === "$and" ? root : []);
				for (let comparison_operator of comparison_operators) {
					let value = sub[comparison_operator];
					_canonicalize_sub_field(name, comparison_operator, value, temp_root);
				}
				if (root_operator !== "$and") {
					root.push( { "$and": temp_root } );
				}
				return root;
			}
		}
	}
	// Case "{ 'name': {} }"
	// Case "{ 'name': [0] }"
	// Case "{ 'name': "0" }"
	// Case "{ 'name': 0 }"
	// Case "{ 'name': false }"
	// Case "{ 'name': null }"
	let value = sub_or_value;
	return _canonicalize_sub_field(name, "$eq", value, root);
}



function _canonicalize_sub_field(name, comparison_operator, value, root) {
	if (!_is_name(name)) {
		throw new Error("Invalid name: " + name);
	}
	if (!_is_operator(comparison_operator)) {
		throw new Error("Invalid comparison_operator: " + comparison_operator);
	}
	if (!_is_json_value(value)) {
		throw new Error("Invalid value: " + value);
	}
	if (value !== null && value.constructor === Object) {
		throw new Error("Embedded documents are not supported: " + value);
	}
	if (!_is_array(root)) {
		throw new Error("Invalid root: " + root);
	}
	root.push( { [name]: { [comparison_operator]: value } } );
	return root;
}



let assert = require("assert");

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


// _canonicalize
// -------------
assert.deepStrictEqual(_canonicalize({}), {});
// --------
assert.throws(() => _canonicalize({ "x": {} }), /Embedded documents/);
assert.deepStrictEqual(_canonicalize({ "x": [0] }), { "x": { "$eq": [0] } });
assert.deepStrictEqual(_canonicalize({ "x": "0" }), { "x": { "$eq": "0" } });
assert.deepStrictEqual(_canonicalize({ "x": 0 }), { "x": { "$eq": 0 } });
assert.deepStrictEqual(_canonicalize({ "x": false }), { "x": { "$eq": false } });
assert.deepStrictEqual(_canonicalize({ "x": null }), { "x": { "$eq": null } });
// --------
assert.deepStrictEqual(_canonicalize({ "x": { "$eq": 0 } }), { "x": { "$eq": 0 } });
assert.deepStrictEqual(_canonicalize({ "x": { "$gt": 2, "$lt": 3 } }), { "$and": [ { "x": { "$gt": 2 } }, { "x": { "$lt": 3 } } ] });
assert.deepStrictEqual(_canonicalize({ "x": 0, "y": 1 }), { "$and": [ { "x": { "$eq": 0 } }, { "y": { "$eq": 1 } } ] });
assert.deepStrictEqual(_canonicalize({ "x": { "$eq": 0 }, "y": { "$eq": 1 } }), { "$and": [ { "x": { "$eq": 0 } }, { "y": { "$eq": 1 } } ] });
assert.deepStrictEqual(_canonicalize({ "x": { "$gt": 2, "$lt": 3 } }), { "$and": [ { "x": { "$gt": 2 } }, { "x": { "$lt": 3 } } ] });
assert.deepStrictEqual(_canonicalize({ "x": { "$gt": 2, "$lt": 3 }, "y": { "$gt": 4, "$lt": 5 } }), { "$and": [ { "x": { "$gt": 2 } }, { "x": { "$lt": 3 } }, { "y": { "$gt": 4 } }, { "y": { "$lt": 5 } } ] });
// --------
assert.deepStrictEqual(_canonicalize({ "$and": [ {} ] }), {});
assert.throws(() => _canonicalize({ "$and": [ { "x": {} } ] }), /Embedded documents/);
assert.deepStrictEqual(_canonicalize({ "$and": [ { "x": 0 } ] }), { "x": { "$eq": 0 } });
assert.deepStrictEqual(_canonicalize({ "$and": [ { "x": { "$eq": 0 } } ] }), { "x": { "$eq": 0 } });
assert.deepStrictEqual(_canonicalize({ "$and": [ { "x": { "$gt": 2, "$lt": 3 } } ] }), { "$and": [ { "x": { "$gt": 2 } }, { "x": { "$lt": 3 } } ] });
assert.deepStrictEqual(_canonicalize({ "$and": [ { "x": 0, "y": 1 } ] }), { "$and": [ { "x": { "$eq": 0 } }, { "y": { "$eq": 1 } } ] });
assert.deepStrictEqual(_canonicalize({ "$and": [ { "x": { "$eq": 0 }, "y": { "$eq": 1 } } ] }), { "$and": [ { "x": { "$eq": 0 } }, { "y": { "$eq": 1 } } ] });
assert.deepStrictEqual(_canonicalize({ "$and": [ { "x": { "$gt": 2, "$lt": 3 } } ] }), { "$and": [ { "x": { "$gt": 2 } }, { "x": { "$lt": 3 } } ] });
assert.deepStrictEqual(_canonicalize({ "$and": [ { "x": { "$gt": 2, "$lt": 3 }, "y": { "$gt": 4, "$lt": 5 } } ] }), { "$and": [ { "x": { "$gt": 2 } }, { "x": { "$lt": 3 } }, { "y": { "$gt": 4 } }, { "y": { "$lt": 5 } } ] });
// --------
assert.deepStrictEqual(_canonicalize({ "$or": [ {} ] }), {});
assert.throws(() => _canonicalize({ "$or": [ { "x": {} } ] }), /Embedded documents/);
assert.deepStrictEqual(_canonicalize({ "$or": [ { "x": 0 } ] }), { "x": { "$eq": 0 } });
assert.deepStrictEqual(_canonicalize({ "$or": [ { "x": { "$eq": 0 } } ] }), { "x": { "$eq": 0 } });
assert.deepStrictEqual(_canonicalize({ "$or": [ { "x": { "$gt": 2, "$lt": 3 } } ] }), { "$and": [ { "x": { "$gt": 2 } }, { "x": { "$lt": 3 } } ] });
assert.deepStrictEqual(_canonicalize({ "$or": [ { "x": 0, "y": 1 } ] }), { "$and": [ { "x": { "$eq": 0 } }, { "y": { "$eq": 1 } } ] });
assert.deepStrictEqual(_canonicalize({ "$or": [ { "x": { "$eq": 0 }, "y": { "$eq": 1 } } ] }), { "$and": [ { "x": { "$eq": 0 } }, { "y": { "$eq": 1 } } ] });
assert.deepStrictEqual(_canonicalize({ "$or": [ { "x": { "$gt": 2, "$lt": 3 } } ] }), { "$and": [ { "x": { "$gt": 2 } }, { "x": { "$lt": 3 } } ] });
assert.deepStrictEqual(_canonicalize({ "$or": [ { "x": { "$gt": 2, "$lt": 3 }, "y": { "$gt": 4, "$lt": 5 } } ] }), { "$and": [ { "x": { "$gt": 2 } }, { "x": { "$lt": 3 } }, { "y": { "$gt": 4 } }, { "y": { "$lt": 5 } } ] });
// --------
assert.deepStrictEqual(_canonicalize(
	{ "$and": [
		{},
		{ "x": 0 }
	] }
),
	{ "x": { "$eq": 0 } }
);
assert.deepStrictEqual(_canonicalize(
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
assert.deepStrictEqual(_canonicalize(
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
assert.deepStrictEqual(_canonicalize(
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
assert.deepStrictEqual(_canonicalize(
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
assert.deepStrictEqual(_canonicalize(
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
assert.deepStrictEqual(_canonicalize(
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
assert.deepStrictEqual(_canonicalize(
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
// console.log(JSON.stringify(_canonicalize(
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
// assert.deepStrictEqual(_canonicalize(
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
