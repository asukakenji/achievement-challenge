"use strict";

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

/**
 * Terminology:
 * For tossing a fair coin, "even odds" occurs.
 * It is said to be "1 to 1" or "2 for 1".
 * The payout will be one unit per unit wagered plus the original stake.
 */

let machines = {
	"High Chance (zero sum)": {
		"chance": 80,
		"payout": 25
	},
	"Medium Chance (zero sum)": {
		"chance": 50,
		"payout": 100
	},
	"Low Chance (zero sum)": {
		"chance": 20,
		"payout": 400
	},
	"Double (for testing)": {
		"chance": 100,
		"payout": 100
	}
};

let queues = {
	"lv": {
		"comment": "Level - Experience (xp) represents the value of the current level",
	},
	"hr": {
		"comment": "High Roller - Achievement for wager amount (chips spent in one spin)",
	},
	"bs": {
		"comment": "Big Spender - Achievement for wager amount (total chips spent)",
	},
	"ls": {
		"comment": "Lucky Star - Achievement for payout amount (chips won in one spin)",
	}
};

let achievements = {
	"lv002": {
		"queue": "lv",
		"condition": {
			"lv": { "$eq": 1 },
			"xp": { "$gte": 300 }
		},
		"action": {
			"$set": { "lv": 2 },
			"$inc": { "xp": -300 }
		}
	},
	"lv003": {
		"queue": "lv",
		"condition": {
			"lv": { "$eq": 2 },
			"xp": { "$gte": 700 }
		},
		"action": {
			"$set": { "lv": 3 },
			"$inc": { "xp": -700 }
		}
	},
	"lv004": {
		"queue": "lv",
		"condition": {
			"lv": { "$eq": 3 },
			"xp": { "$gte": 1000 }
		},
		"action": {
			"$set": { "lv": 4 },
			"$inc": { "xp": -1000 }
		}
	},
	"lv005": {
		"queue": "lv",
		"condition": {
			"lv": { "$eq": 4 },
			"xp": { "$gte": 1400 }
		},
		"action": {
			"$set": { "lv": 5 },
			"$inc": { "xp": -1400 },
			"$push": {
				"mb": {
					"bonus": 3700
				}
			}
		}
	},

	"hr_bronze": {
		"queue": "hr",
		"condition": {
			"wager": { "$gte": 100 }
		},
		"action": {
			"$push": {
				"mb": {
					"bonus": 500,
					"xp": 100
				}
			}
		}
	},
	"hr_silver": {
		"queue": "hr",
		"condition": {
			"wager": { "$gte": 1000 }
		},
		"action": {
			"$push": {
				"mb": {
					"bonus": 5000,
					"xp": 1000
				}
			}
		}
	},
	"hr_gold": {
		"queue": "hr",
		"condition": {
			"wager": { "$gte": 10000 }
		},
		"action": {
			"$push": {
				"mb": {
					"bonus": 50000,
					"xp": 10000
				}
			}
		}
	},

	"bs_bronze": {
		"queue": "bs",
		"condition": {
			"wagerAccumulated": { "$gte": 10000 }
		},
		"action": {
			"$push": {
				"mb": {
					"xp": 1000
				}
			}
		}
	},
	"bs_silver": {
		"queue": "bs",
		"condition": {
			"wagerAccumulated": { "$gte": 100000 }
		},
		"action": {
			"$push": {
				"mb": {
					"xp": 2000
				}
			}
		}
	},
	"bs_gold": {
		"queue": "bs",
		"condition": {
			"wagerAccumulated": { "$gte": 1000000 }
		},
		"action": {
			"$push": {
				"mb": {
					"xp": 5000
				}
			}
		}
	},

	"ls_bronze": {
		"queue": "ls",
		"condition": {
			"payout": { "$gte": 10000 }
		},
		"action": {
			"$push": {
				"mb": {
					"loyalty": 100
				}
			}
		}
	},
	"ls_silver": {
		"queue": "ls",
		"condition": {
			"payout": { "$gte": 10000 }
		},
		"action": {
			"$push": {
				"mb": {
					"loyalty": 150
				}
			}
		}
	},
	"ls_gold": {
		"queue": "ls",
		"condition": {
			"payout": { "$gte": 10000 }
		},
		"action": {
			"$push": {
				"mb": {
					"loyalty": 200
				}
			}
		}
	}
};
