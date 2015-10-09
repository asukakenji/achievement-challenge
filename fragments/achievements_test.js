"use strict";

let assert = require("assert");
let achievements = require("./achievements");
assert.deepStrictEqual(achievements["lv002"],
	{
		"queue": "lv",
		"condition": {
			"lv": { "$eq": 1 },
			"xp": { "$gte": 300 }
		},
		"action": {
			"$set": { "lv": 2 },
			"$inc": { "xp": -300 }
		}
	}
);
assert.throws(() => require("./achievements_bad"), SyntaxError);
