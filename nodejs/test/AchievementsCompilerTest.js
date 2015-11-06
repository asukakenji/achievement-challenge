'use strict';

const AchievementsCompiler = require('../lib/AchievementsCompiler');
const achievements_object = require('../json/achievements');
const assert = require('assert');

describe('AchievementsCompiler', function () {

  describe('#compile()', function () {
    it('should compile the target correctly', function () {
      assert.deepStrictEqual(
        AchievementsCompiler.compile(achievements_object),
        {
          'lv002': {
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
          },
          'lv003': {
            'name': 'lv003',
            'queue': 'lv',
            'target': 'player',
            'condition': {
              'lv': { '$eq': 2 },
              'xp': { '$gte': 700 }
            },
            'action': {
              '$inc': { 'xp': -700 },
              '$set': { 'lv': 3 }
            }
          },
          'lv004': {
            'name': 'lv004',
            'queue': 'lv',
            'target': 'player',
            'condition': {
              'lv': { '$eq': 3 },
              'xp': { '$gte': 1000 }
            },
            'action': {
              '$inc': { 'xp': -1000 },
              '$set': { 'lv': 4 }
            }
          },
          'lv005': {
            'name': 'lv005',
            'queue': 'lv',
            'target': 'player',
            'condition': {
              'lv': { '$eq': 4 },
              'xp': { '$gte': 1400 }
            },
            'action': {
              '$inc': { 'xp': -1400 },
              '$set': { 'lv': 5 }
            }
          },
          'lv006': {
            'name': 'lv006',
            'queue': 'lv',
            'target': 'player',
            'condition': {
              'lv': { '$eq': 5 },
              'xp': { '$gte': 9550 }
            },
            'action': {
              '$inc': { 'xp': -9550 },
              '$set': { 'lv': 6 }
            }
          },
          'lv007': {
            'name': 'lv007',
            'queue': 'lv',
            'target': 'player',
            'condition': {
              'lv': { '$eq': 6 },
              'xp': { '$gte': 13000 }
            },
            'action': {
              '$inc': { 'xp': -13000 },
              '$set': { 'lv': 7 }
            }
          },
          'lv008': {
            'name': 'lv008',
            'queue': 'lv',
            'target': 'player',
            'condition': {
              'lv': { '$eq': 7 },
              'xp': { '$gte': 17000 }
            },
            'action': {
              '$inc': { 'xp': -17000 },
              '$set': { 'lv': 8 }
            }
          },
          'lv009': {
            'name': 'lv009',
            'queue': 'lv',
            'target': 'player',
            'condition': {
              'lv': { '$eq': 8 },
              'xp': { '$gte': 20000 }
            },
            'action': {
              '$inc': { 'xp': -20000 },
              '$set': { 'lv': 9 }
            }
          },
          'hr_bronze': {
            'name': 'hr_bronze',
            'queue': 'hr',
            'target': 'spin',
            'condition': {
              'wager': { '$gte': 100 }
            },
            'action': {
              '$push': {
                'mails': {
                  'name': 'hr_bronze',
                  'xp': 100,
                  'bonus': 500
                }
              }
            }
          },
          'hr_silver': {
            'name': 'hr_silver',
            'queue': 'hr',
            'target': 'spin',
            'condition': {
              'wager': { '$gte': 1000 }
            },
            'action': {
              '$push': {
                'mails': {
                  'name': 'hr_silver',
                  'xp': 1000,
                  'bonus': 5000
                }
              }
            }
          },
          'hr_gold': {
            'name': 'hr_gold',
            'queue': 'hr',
            'target': 'spin',
            'condition': {
              'wager': { '$gte': 10000 }
            },
            'action': {
              '$push': {
                'mails': {
                  'name': 'hr_gold',
                  'xp': 10000,
                  'bonus': 50000
                }
              }
            }
          },
          'bs_bronze': {
            'name': 'bs_bronze',
            'queue': 'bs',
            'target': 'player',
            'condition': {
              'wagerAccumulated': { '$gte': 10000 }
            },
            'action': {
              '$push': {
                'mails': {
                  'name': 'bs_bronze',
                  'xp': 1000
                }
              }
            }
          },
          'bs_silver': {
            'name': 'bs_silver',
            'queue': 'bs',
            'target': 'player',
            'condition': {
              'wagerAccumulated': { '$gte': 100000 }
            },
            'action': {
              '$push': {
                'mails': {
                  'name': 'bs_silver',
                  'xp': 2000
                }
              }
            }
          },
          'bs_gold': {
            'name': 'bs_gold',
            'queue': 'bs',
            'target': 'player',
            'condition': {
              'wagerAccumulated': { '$gte': 1000000 }
            },
            'action': {
              '$push': {
                'mails': {
                  'name': 'bs_gold',
                  'xp': 5000
                }
              }
            }
          },
          'ls_bronze': {
            'name': 'ls_bronze',
            'queue': 'ls',
            'target': 'spin',
            'condition': {
              'payout': { '$gte': 10000 }
            },
            'action': {
              '$push': {
                'mails': {
                  'name': 'ls_bronze',
                  'lp': 100
                }
              }
            }
          },
          'ls_silver': {
            'name': 'ls_silver',
            'queue': 'ls',
            'target': 'spin',
            'condition': {
              'payout': { '$gte': 100000 }
            },
            'action': {
              '$push': {
                'mails': {
                  'name': 'ls_silver',
                  'lp': 150
                }
              }
            }
          },
          'ls_gold': {
            'name': 'ls_gold',
            'queue': 'ls',
            'target': 'spin',
            'condition': {
              'payout': { '$gte': 1000000 }
            },
            'action': {
              '$push': {
                'mails': {
                  'name': 'ls_gold',
                  'lp': 200
                }
              }
            }
          },
          'pc_bronze': {
            'name': 'pc_bronze',
            'queue': 'pc',
            'target': 'player',
            'condition': {
              'payoutAccumulated': { '$gte': 10000 }
            },
            'action': {
              '$push': {
                'mails': {
                  'name': 'pc_bronze',
                  'xp': 1000
                }
              }
            }
          },
          'pc_silver': {
            'name': 'pc_silver',
            'queue': 'pc',
            'target': 'player',
            'condition': {
              'payoutAccumulated': { '$gte': 100000 }
            },
            'action': {
              '$push': {
                'mails': {
                  'name': 'pc_silver',
                  'xp': 2000
                }
              }
            }
          },
          'pc_gold': {
            'name': 'pc_gold',
            'queue': 'pc',
            'target': 'player',
            'condition': {
              'payoutAccumulated': { '$gte': 1000000 }
            },
            'action': {
              '$push': {
                'mails': {
                  'name': 'pc_gold',
                  'xp': 5000
                }
              }
            }
          },
          'lv005bonus': {
            'name': 'lv005bonus',
            'target': 'player',
            'condition': {
              'lv': { '$gte': 5 }
            },
            'action': {
              '$push': {
                'mails': {
                  'lv005bonus': {
                    'bonus': 3700
                  }
                }
              }
            }
          },
          'lv010bonus': {
            'name': 'lv010bonus',
            'target': 'player',
            'condition': {
              'lv': { '$gte': 10 }
            },
            'action': {
              '$push': {
                'mails': {
                  'lv010bonus': {
                    'bonus': 19000
                  }
                }
              }
            }
          }
        }
      );
    });
  });

});
