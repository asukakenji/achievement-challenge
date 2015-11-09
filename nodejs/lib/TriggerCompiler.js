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
      // TODO: Error message
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
function optimize_condition(canonicalized_condition_object) {
  return canonicalized_condition_object;
}

/**
 * Canonicalizes an action object.
 */
// private
function canonicalize_action(action_object) {
  const result = [];

  const checked_update_expression = Utils.checkObject(action_object);
  const update_operators = Object.keys(checked_update_expression);
  for (const update_operator of update_operators) {
    const update_sub = checked_update_expression[update_operator];
    const fields = Object.keys(update_sub);
    for (const field of fields) {
      const value = update_sub[field];
      result.push({
        [update_operator]: {
          [field]: value
        }
      });
    }
  }

  return result;
}

/**
 * Compiles an canonicalized trigger object.
 */
// private
function compile_trigger(canonicalized_trigger_object) {

  function make_predicate(condition_object) {
    const checked_condition_object = Utils.checkObject(condition_object);
    const keys = Object.keys(checked_condition_object);
    if (keys.length === 0) {
      return function() {
        return true;
      };
    } else if (keys.length === 1) {
      const lop_or_name = keys[0];
      if (lop_or_name.charAt(0) === '$') {
        const value = checked_condition_object[lop_or_name];
        return make_logical_operator_predicate(lop_or_name, value);
      } else {
        const sub_field = checked_condition_object[lop_or_name];
        const keys2 = Object.keys(sub_field);
        if (keys2.length === 1) {
          const cop = keys2[0];
          const value = sub_field[cop];
          return make_comparison_operator_predicate(cop, lop_or_name, value);
        }
      }
    }
    // TODO: Error message
    throw new TypeError();
  }

  function make_logical_operator_predicate(logical_operator, operands) {
    const checked_logical_operator = Utils.checkNonEmptyStringSW(logical_operator, '$');
    const checked_operands = Utils.checkArray(operands);
    const builder = get_lop_builder(checked_logical_operator);
    for (const operand of checked_operands) {
      const predicate = make_predicate(operand);
      builder.add(predicate);
    }
    return builder.build();
  }

  function get_lop_builder(logical_operator) {
    const predicates = [];

    function add(predicate) {
      predicates.push(predicate);
    };

    function build_and() {
      return function(target) {
        for (const predicate of predicates) {
          if (!predicate(target)) {
            return false;
          }
        }
        return true;
      };
    }

    function build_or() {
      return function(target) {
        for (const predicate of predicates) {
          if (predicate(target)) {
            return true;
          }
        }
        return false;
      };
    }

    switch (logical_operator) {
      case '$and':
        return {
          'add': add,
          'build': build_and
        };
      case '$or':
        return {
          'add': add,
          'build': build_or
        };
      default:
        // TODO: Error message
        throw new TypeError();
    }
    return builder;
  }

  function make_comparison_operator_predicate(operator, name, value) {
    switch(operator) {
      case '$eq':
        return function(target) {
          return (target[name] === value);
        };
      case '$gt':
        return function(target) {
          return (target[name] > value);
        };
      case '$gte':
        return function(target) {
          return (target[name] >= value);
        };
      case '$lt':
        return function(target) {
          return (target[name] < value);
        };
      case '$lte':
        return function(target) {
          return (target[name] <= value);
        };
      case '$ne':
        return function(target) {
          return (target[name] !== value);
        };
      default:
        // TODO: Error message
        throw new TypeError();
    }
  }

  function make_consumer(action_array) {
    const consumers = [];
    const checked_action_array = Utils.checkArray(action_array);
    for (const action_object of checked_action_array) {
      const keys = Object.keys(action_object);
      if (keys.length === 1) {
        const uop = keys[0];
        const sub_field = action_object[uop];
        const keys2 = Object.keys(sub_field);
        if (keys2.length === 1) {
          const name = keys2[0];
          const value = sub_field[name];
          const consumer = make_update_operator_consumer(uop, name, value);
          consumers.push(consumer);
          continue;
        }
      }
      // TODO: Error message
      throw new TypeError();
    }
    return function(target) {
      for (const consumer of consumers) {
        consumer(target);
      }
    };
  }

  function make_update_operator_consumer(operator, name, value) {
    switch (operator) {
      case '$inc':
        return function(target) {
          target[name] += value;
        };
      case '$set':
        return function(target) {
          target[name] = value;
        };
      case '$addToSet':
        return function(target) {
          if (target.indexOf(value) === -1) {
            target.push(value);
          }
        };
      case '$push':
        return function(target) {
          target.push(value);
        }
      default:
        // TODO: Error message
        throw new TypeError();
    }
  }

  const predicate = make_predicate(canonicalized_trigger_object.condition);
  const consumer = make_consumer(canonicalized_trigger_object.action);
  return function(target) {
    if (predicate(target)) {
      consumer(target);
      return true;
    } else {
      return false;
    }
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
    const optimized_condition_object = optimize_condition(canonicalized_condition_object);
    const canonicalized_action_array = canonicalize_action(trigger_object.action);
    const canonicalized_trigger_object = {
      'name': name,
      'queue': queue,
      'target': target,
      'condition': optimized_condition_object,
      'action': canonicalized_action_array
    };
    const trigger_function = compile_trigger(canonicalized_trigger_object);
    return {
      source: canonicalized_trigger_object,
      function: trigger_function
    };
  }

}

module.exports = TriggerCompiler;
