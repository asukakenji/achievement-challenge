"use strict";

module.exports = {
	canonicalize: _canonicalize,
	test_private: function(f) {
		f(
			_canonicalize_sub_field,
			_canonicalize_sub_or_value,
			_canonicalize_tree_list,
			_canonicalize_match_expression_element,
			_canonicalize
		);
	}
};



/**
 * Canonicalizes a match expression.
 * For example,
 * {
 *     "x": { "$gt": 1, "$lt": 2 },
 *     "y": { "$gt": 3, "$lt": 4 }
 * }
 * will be canonicalized into:
 * {
 *     "$and": [
 *         { "x": { "$gt": 1 } },
 *         { "x": { "$lt": 2 } },
 *         { "y": { "$gt": 3 } },
 *         { "y": { "$lt": 4 } }
 *     ]
 * }
 */
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



/**
 * Checks whether a value is a valid JSON value.
 * Valid JSON values:
 * - Objects
 * - Arrays
 * - Strings
 * - Numbers
 * - Booleans (true / false)
 * - Null (null)
 */
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
