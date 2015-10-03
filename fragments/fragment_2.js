"use strict";

const PLAYER_PROPERTIES = Object.freeze([
	"lv",
	"xp",
	"loyalty",
	"wager",
	"bonus",
	"chips",
	"wagerAccumulated",
	"bonusAccumulated",
	"spinAccumulated"
]);

const COMPARISON_OPERATORS = Object.freeze({
	"$eq":
		function(value) {
			return function(property_function) {
				return function(player) {
					return property_function(player) === value;
				};
			};
		},
	"$gt":
		function(value) {
			return function(property_function) {
				return function(player) {
					return property_function(player) > value;
				};
			};
		},
	"$gte":
		function(value) {
			return function(property_function) {
				return function(player) {
					return property_function(player) >= value;
				};
			};
		},
	"$lt":
		function(value) {
			return function(property_function) {
				return function(player) {
					return property_function(player) < value;
				};
			};
		},
	"$lte":
		function(value) {
			return function(property_function) {
				return function(player) {
					return property_function(player) <= value;
				};
			};
		},
	"$ne":
		function(value) {
			return function(property_function) {
				return function(player) {
					return property_function(player) !== value;
				};
			};
		}
});

const LOGICAL_OPERATORS = Object.freeze({
	"$or":
		// Implementation Note:
		// Used "rest parameter" here (and other places) to avoid errors when no argument is passed
		function(...property_comparison_functions) {
			return function(player) {
				for (let pcf of property_comparison_functions) {
					if (pcf(player)) return true;
				};
				return false;
			};
		},
	"$and":
		function(...property_comparison_functions) {
			return function(player) {
				for (let pcf of property_comparison_functions) {
					if (!pcf(player)) return false;
				};
				return true;
			};
		}
});

function Player() {
	this.lv = 1;
	this.xp = 0;
	this.loyalty = 100;
	/* wager = chip */
	/* bonus = chip */
	this.chips = 3000;
	this.wagerAccumulated = 0;
	this.bonusAccumulated = 0;
	this.spinAccumulated = 0;
}

function make_property_function(property) {
	if (PLAYER_PROPERTIES.indexOf(property) === -1) {		// assert
		throw new Error("Unknown property: " + property);	// assert
	}														// assert
	return function(player) {
		return player[property];
	};
}

function make_property_comparison_function(property_function, operator, value) {
	// Implementation Note:
	// Object.propertyIsEnumerable() already checks "own property" + "enumerable"
	if (!COMPARISON_OPERATORS.propertyIsEnumerable(operator)) {			// assert
		throw new Error("Unknown comparison operator: " + operator);	// assert
	}																	// assert
	let comparison_operator_function = COMPARISON_OPERATORS[operator];
	return comparison_operator_function(value)(property_function);
}

function make_logical_operator_function(operator, ...property_comparison_functions) {
	if (!LOGICAL_OPERATORS.propertyIsEnumerable(operator)) {		// assert
		throw new Error("Unknown logical operator: " + operator);	// assert
	}																// assert
	let logical_operator_function = LOGICAL_OPERATORS[operator];
	return logical_operator_function(...property_comparison_functions);
}

let pf_lv = make_property_function("lv");
let pcf_lv_eq_1 = make_property_comparison_function(pf_lv, "$eq", 1);

let pf_xp = make_property_function("xp");
let pcf_xp_gte_300 = make_property_comparison_function(pf_xp, "$gte", 300);

let lof_lv_eq_1_or_xp_gte_300 = make_logical_operator_function("$or", pcf_lv_eq_1, pcf_xp_gte_300);
let lof_lv_eq_1_and_xp_gte_300 = make_logical_operator_function("$and", pcf_lv_eq_1, pcf_xp_gte_300);

let player1 = new Player();

console.log(pf_lv(player1));    // 1
console.log(pcf_lv_eq_1(player1));    // true
player1.lv = 2;
console.log(pcf_lv_eq_1(player1));    // false
console.log("--------");

console.log(pf_xp(player1));    // 0
console.log(pcf_xp_gte_300(player1));    // false
player1.xp = 321;
console.log(pcf_xp_gte_300(player1));    // true
console.log("--------");

let player2 = new Player();

console.log(lof_lv_eq_1_or_xp_gte_300(player2));    // true
player2.lv = 2;
console.log(lof_lv_eq_1_or_xp_gte_300(player2));    // false
player2.xp = 321;
console.log(lof_lv_eq_1_or_xp_gte_300(player2));    // true
player2.lv = 1;
console.log(lof_lv_eq_1_or_xp_gte_300(player2));    // true
console.log("--------");

let player3 = new Player();

console.log(lof_lv_eq_1_and_xp_gte_300(player3));    // false
player3.lv = 2;
console.log(lof_lv_eq_1_and_xp_gte_300(player3));    // false
player3.xp = 321;
console.log(lof_lv_eq_1_and_xp_gte_300(player3));    // false
player3.lv = 1;
console.log(lof_lv_eq_1_and_xp_gte_300(player3));    // true
console.log("--------");
