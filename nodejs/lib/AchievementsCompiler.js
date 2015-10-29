'use strict';

let Utils = require('./Utils');
let LVCompiler = require('./LevelCompiler');
let HRCompiler = require('./HighRollerAchievementCompiler');
let BSCompiler = require('./BigSpenderAchievementCompiler');
let LSCompiler = require('./LuckyStarAchievementCompiler');
let PCCompiler = require('./PerennialChampionAchievementCompiler');

// private
function compile_simple_achievements(achievement_array, triggers_object, compiler) {
  const checked_achievement_array = Utils.checkArray(achievement_array);
  if (compiler === undefined) {
    for (const achievement_object of checked_achievement_array) {
      const name = Utils.checkNonEmptyString(achievement_object.name);
      if (triggers_object[name] === undefined) {
        triggers_object[name] = achievement_object;
      } else {
        throw new Error('Duplicated key: ' + name);
      }
    }
  } else {
    for (const achievement_object of checked_achievement_array) {
      const achievement_trigger_object = compiler.compile(achievement_object);
      const name = achievement_trigger_object.name;
      if (triggers_object[name] === undefined) {
        triggers_object[name] = achievement_trigger_object;
      } else {
        throw new Error('Duplicated key: ' + name);
      }
    }
  }
}

class AchievementsCompiler {

  /**
   * Compiles an achievements object to a trigger object.
   */
  static compile(achievements_object) {
    let triggers_object = {};
    for (let key of Object.keys(achievements_object)) {
      switch (key) {
      case 'levels':
        this.compileLevels(achievements_object.levels, triggers_object);
        break;
      case 'highRollerAchievements':
        this.compileHighRollerAchievements(achievements_object.highRollerAchievements, triggers_object);
        break;
      case 'bigSpenderAchievements':
        this.compileBigSpenderAchievements(achievements_object.bigSpenderAchievements, triggers_object);
        break;
      case 'luckyStarAchievements':
        this.compileLuckyStarAchievements(achievements_object.luckyStarAchievements, triggers_object);
        break;
      case 'perennialChampionAchievements':
        this.compilePerennialChampionAchievements(achievements_object.perennialChampionAchievements, triggers_object);
        break;
      case 'achievements':
        this.compileArchievements(achievements_object.achievements, triggers_object);
        break;
      default:
        throw new Error('Unknown key: ' + key);
      }
    }
    return triggers_object;
  }

  /**
   * Compiles a level array and add the result to the trigger object.
   */
  static compileLevels(level_array, triggers_object) {
    compile_simple_achievements(level_array, triggers_object, LVCompiler);
  }

  /**
   * Compiles a high roller achievement array and add the result to the trigger object.
   */
  static compileHighRollerAchievements(hr_array, triggers_object) {
    compile_simple_achievements(hr_array, triggers_object, HRCompiler);
  }

  /**
   * Compiles a big spender achievement array and add the result to the trigger object.
   */
  static compileBigSpenderAchievements(bs_array, triggers_object) {
    compile_simple_achievements(bs_array, triggers_object, BSCompiler);
  }

  /**
   * Compiles a lucky star achievement array and add the result to the trigger object.
   */
  static compileLuckyStarAchievements(ls_array, triggers_object) {
    compile_simple_achievements(ls_array, triggers_object, LSCompiler);
  }

  /**
   * Compiles a perennial champion achievement array and add the result to the trigger object.
   */
  static compilePerennialChampionAchievements(pc_array, triggers_object) {
    compile_simple_achievements(pc_array, triggers_object, PCCompiler);
  }

  /**
   * Compiles an achievement array and add the result to the trigger object.
   */
  static compileArchievements(achievement_array, triggers_object) {
    compile_simple_achievements(achievement_array, triggers_object);
  }

}

module.exports = AchievementsCompiler;
