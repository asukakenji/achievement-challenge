'use strict';

/**
 * Canonicalizes a condition object.
 */
// private
function canonicalize_condition(condition_object) {
  return condition_object;
}

/**
 * Optimizes a canonicalized condition object.
 */
// private
function optimized_condition(canonicalized_condition_object) {
  return canonicalized_condition_object;
}

/**
 * Canonicalizes an action object.
 */
// private
function canonicalize_action(action_object) {
  return action_object;
}

/**
 * Compiles an optimized trigger object.
 */
// private
function compile_trigger(optimized_trigger_object) {
  return function() {
    return false;
  };
}

class TriggerCompiler {

  /**
   * Compiles a trigger object to a function.
   */
  static compile(trigger_object) {
    const name = trigger_object.name;
    const queue = trigger_object.queue;
    const target = trigger_object.target;
    const condition_object = trigger_object.condition;
    const action_object = trigger_object.action;
    const canonicalized_condition_object = canonicalize_condition(trigger_object.condition);
    const optimized_condition_object = optimized_condition(canonicalized_condition_object);
    const canonicalized_action_object = canonicalize_action(trigger_object.action);
    const optimized_trigger_object = {
      'name': name,
      'queue': queue,
      'target': target,
      'condition': optimized_condition_object,
      'action': canonicalized_action_object
    };
    const trigger_function = compile_trigger(optimized_trigger_object);
    return {
      source: trigger_object,
      function: trigger_function
    };
  }

}

module.exports = TriggerCompiler;
