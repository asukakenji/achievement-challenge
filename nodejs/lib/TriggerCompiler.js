'use strict';

const Utils = require('./Utils');

/**
 * Canonicalizes a condition object.
 */
// private
function canonicalize_condition(condition_object) {
  return canonicalize_match_expression(condition_object);
}

// private
function canonicalize_match_expression(match_expression) {
  const checked_match_expression = Utils.checkObject(match_expression);
  const field_names = Object.keys(checked_match_expression);
  switch (field_names.length) {
    case 0: {
      // Case: {}
      return {};
    }
    case 1: {
      // Case: { "$lop": ... }
      // Case: { "name": ... }
      const field_name = field_names[0];
      const field_value = checked_match_expression[field_name];
      return canonicalize_match_expression_element(field_name, field_value);
    }
    default: {
      // Case: { "$lop1": ..., "$lop2": ... }
      // Case: { "$lop": ..., "name": ... }
      // Case: { "name1": ..., "name2": ... }
      const canonicalized_match_expression_element_array = [];
      for (const field_name of field_names) {
        const field_value = checked_match_expression[field_name];
        const canonicalized_match_expression_element = canonicalize_match_expression_element(field_name, field_value);
        canonicalized_match_expression_element_array.push(canonicalized_match_expression_element);
      }
      return {
        '$and': canonicalized_match_expression_element_array
      };
    }
  }
}

// private
function canonicalize_match_expression_element(field_name, field_value) {
  const checked_field_name = Utils.checkNonEmptyString(field_name);
  if (field_name.charAt(0) === '$') {
    // Case: { "$lop": ... }
    return canonicalize_tree_list(checked_field_name, field_value);
  } else {
    // Case: { "name": ... }
    return canonicalize_sub_or_value(checked_field_name, field_value);
  }
}

// private
function canonicalize_tree_list(logical_operator, operands) {
  const checked_logical_operator = Utils.checkNonEmptyStringSW(logical_operator, '$');
  const checked_operands = Utils.checkArray(operands);
  switch (checked_operands.length) {
    case 0: {
      // Case: { "$lop": [] }
      throw new TypeError();
    }
    case 1: {
      // Case: { "$lop": [ { ... } ] }
      return canonicalize_match_expression(operands[0]);
    }
    default: {
      // Case: { "$lop": [ { ... }, { ... } ] }
      const canonicalized_operand_array = [];
      for (const operand of checked_operands) {
        const canonicalized_operand = canonicalize_match_expression(operand);
        canonicalized_operand_array.push(canonicalized_operand);
      }
      return {
        [checked_logical_operator]: canonicalized_operand_array
      };
    }
  }
}

// private
function canonicalize_sub_or_value(name, sub_or_value) {
  const checked_name = Utils.checkNonEmptyStringNSW(name, '$');
  const checked_sub_or_value = Utils.checkJSONValue(sub_or_value);
  if (Utils.isObject(checked_sub_or_value)) {
    // Case: { "name": {} }
    // Case: { "name": { "$cop": ... } }
    // Case: { "name": { "$cop1": ..., "$cop2": ... } }
    const sub = checked_sub_or_value;
    const comparison_operators = Object.keys(sub);
    switch (comparison_operators.length) {
      case 0: {
        // Case: { "name": {} }
        // To be handled after the switch statement
        break;
      }
      case 1: {
        // Case: { "name": { "$cop": ... } }
        const comparison_operator = comparison_operators[0];
        const value = sub[comparison_operator];
        return canonicalize_sub_field(checked_name, comparison_operator, value);
      }
      default: {
        // Case: { "name": { "$cop1": ..., "$cop2": ... } }
        const canonicalized_sub_field_array = [];
        for (const comparison_operator of comparison_operators) {
          const value = sub[comparison_operator];
          const canonicalized_sub_field = canonicalize_sub_field(checked_name, comparison_operator, value);
          canonicalized_sub_field_array.push(canonicalized_sub_field);
        }
        return {
          '$and': canonicalized_sub_field_array
        };
      }
    }
  }
  // Case: { "name": {} }
  // Case: { "name": /* array */ }
  // Case: { "name": /* string */ }
  // Case: { "name": /* number */ }
  // Case: { "name": /* boolean */ }
  // Case: { "name": null }
  const value = checked_sub_or_value;
  return canonicalize_sub_field(checked_name, '$eq', value);
}

// private
function canonicalize_sub_field(name, comparison_operator, value) {
  const checked_name = Utils.checkNonEmptyStringNSW(name, '$');
  const checked_comparison_operator = Utils.checkNonEmptyStringSW(comparison_operator, '$');
  const checked_value = Utils.checkJSONValue(value);
  return {
    [checked_name]: {
      [checked_comparison_operator]: checked_value
    }
  };
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
      source: optimized_trigger_object,
      function: trigger_function
    };
  }

}

module.exports = TriggerCompiler;
