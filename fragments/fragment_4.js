"use strict";

module.exports = {
	compile: _compile
};



let f3 = require("./fragment_3");

const PLAYER_PROPERTIES = Object.freeze({
	"lv":
		function(player) {
			return player.lv;
		},
	"xp":
		function(player) {
			return player.xp;
		},
	"loyalty":
		function(player) {
			return player.loyalty;
		},
	"chips":
		function(player) {
			return player.chips;
		},
	"wager":
		function(player) {
			return player.wager;
		},
	"bonus":
		function(player) {
			return player.bonus;
		},
	"wagerAccumulated":
		function(player) {
			return player.wagerAccumulated;
		},
	"bonusAccumulated":
		function(player) {
			return player.bonusAccumulated;
		},
	"spinAccumulated":
		function(player) {
			return player.spinAccumulated;
		}
});

const COMPARISON_OPERATORS = Object.freeze({
	"$eq":
		function(value) {
			return function(player_property_function) {
				return function(player) {
					return player_property_function(player) === value;
				};
			};
		},
	"$gt":
		function(value) {
			return function(player_property_function) {
				return function(player) {
					return player_property_function(player) > value;
				};
			};
		},
	"$gte":
		function(value) {
			return function(player_property_function) {
				return function(player) {
					return player_property_function(player) >= value;
				};
			};
		},
	"$lt":
		function(value) {
			return function(player_property_function) {
				return function(player) {
					return player_property_function(player) < value;
				};
			};
		},
	"$lte":
		function(value) {
			return function(player_property_function) {
				return function(player) {
					return player_property_function(player) <= value;
				};
			};
		},
	"$ne":
		function(value) {
			return function(player_property_function) {
				return function(player) {
					return player_property_function(player) !== value;
				};
			};
		}
});

const LOGICAL_OPERATORS = Object.freeze({
	"$or":
		function(match_expression_functions) {
			return function(player) {
				for (let match_expression_function of match_expression_functions) {
					if (match_expression_function(player)) return true;
				};
				return false;
			};
		},
	"$and":
		function(match_expression_functions) {
			return function(player) {
				for (let match_expression_function of match_expression_functions) {
					if (!match_expression_function(player)) return false;
				};
				return true;
			};
		}
});



function _compile(match_expression) {
	let field_names = Object.keys(match_expression);
	if (field_names.length !== 1) {
		throw new Error("match_expression not canonicalized!");
	}
	let field_name = field_names[0];
	if (field_name.charAt(0) === "$") {
		let logical_operator_function = LOGICAL_OPERATORS[field_name];
		if (logical_operator_function === undefined) {
			throw new Error("Unknown logical_operator: " + field_name);
		}
		let match_expressions = match_expression[field_name];
		let match_expression_functions = match_expressions.map(_compile);
		return logical_operator_function(match_expression_functions);
	} else {
		let player_property_function = PLAYER_PROPERTIES[field_name];
		if (player_property_function === undefined) {
			throw new Error("Unknown player_property: " + field_name);
		}
		let sub = match_expression[field_name];
		let comparison_operators = Object.keys(sub);
		if (comparison_operators.length !== 1) {
			throw new Error("match_expression not canonicalized!");
		}
		let comparison_operator = comparison_operators[0];
		let comparison_operator_function = COMPARISON_OPERATORS[comparison_operator];
		if (comparison_operator_function === undefined) {
			throw new Error("Unknown comparison_operator: " + comparison_operator);
		}
		let value = sub[comparison_operator];
		return comparison_operator_function(value)(player_property_function);
	}
}
