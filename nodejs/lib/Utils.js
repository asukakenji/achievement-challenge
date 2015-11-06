'use strict';

class Utils {

  /* Checks whether the value is a non-empty string. */
  static checkNonEmptyString(value, default_value) {
    if (typeof value === 'string' && value !== '') {
      if (default_value === undefined || typeof default_value === 'string') {
        return value;
      }
    } else if (typeof default_value === 'string' && default_value !== '') {
      if (value === undefined || value === '') {
        return default_value;
      }
    }
    throw new TypeError();
  }

  /* Checks whether the value is a non-empty string which starts with character. */
  static checkNonEmptyStringSW(value, character, default_value) {
    const checked_value = this.checkNonEmptyString(value, default_value);
    const checked_character = this.checkNonEmptyString(character);
    if (checked_character.length !== 1) throw new TypeError();
    if (checked_value.charAt(0) === checked_character) return checked_value;
    throw new TypeError();
  }

  /* Checks whether the value is a non-empty string which does not start with character. */
  static checkNonEmptyStringNSW(value, character, default_value) {
    const checked_value = this.checkNonEmptyString(value, default_value);
    const checked_character = this.checkNonEmptyString(character);
    if (checked_character.length !== 1) throw new TypeError();
    if (checked_value.charAt(0) !== checked_character) return checked_value;
    throw new TypeError();
  }

  /* Checks whether the value is a number. */
  static checkNumber(value, default_value) {
    if (typeof value === 'number') {
      if (default_value === undefined || typeof default_value === 'number') {
        return value;
      }
    } else if (typeof default_value === 'number') {
      if (value === undefined) {
        return default_value;
      }
    }
    throw new TypeError();
  }

  /* Checks whether the value is a number which is greater than reference_value. */
  static checkNumberGT(value, reference_value, default_value) {
    const checked_value = this.checkNumber(value, default_value);
    const checked_reference_value = this.checkNumber(reference_value);
    if (checked_value > checked_reference_value) return checked_value;
    throw new RangeError();
  }

  /* Checks whether the value is a number which is greater than or equal to reference_value. */
  static checkNumberGTE(value, reference_value, default_value) {
    const checked_value = this.checkNumber(value, default_value);
    const checked_reference_value = this.checkNumber(reference_value);
    if (checked_value >= checked_reference_value) return checked_value;
    throw new RangeError();
  }

  /* Checks whether the value is a number which is less than reference_value. */
  static checkNumberLT(value, reference_value, default_value) {
    const checked_value = this.checkNumber(value, default_value);
    const checked_reference_value = this.checkNumber(reference_value);
    if (checked_value < checked_reference_value) return checked_value;
    throw new RangeError();
  }

  /* Checks whether the value is a number which is less than or equal to reference_value. */
  static checkNumberLTE(value, reference_value, default_value) {
    const checked_value = this.checkNumber(value, default_value);
    const checked_reference_value = this.checkNumber(reference_value);
    if (checked_value <= checked_reference_value) return checked_value;
    throw new RangeError();
  }

  /* Checks whether the value is an array. */
  static checkArray(value, default_value) {
    if (value !== undefined && value !== null && value.constructor === Array) {
      if (default_value === undefined || (default_value !== null && default_value.constructor === Array)) {
        return value;
      }
    } else if (default_value !== undefined && default_value !== null && default_value.constructor === Array) {
      if (value === undefined) {
        return default_value;
      }
    }
    throw new TypeError();
  }

  /* Checks whether the value is an object. */
  static checkObject(value, default_value) {
    if (value !== undefined && value !== null && value.constructor === Object) {
      if (default_value === undefined || (default_value !== null && default_value.constructor === Object)) {
        return value;
      }
    } else if (default_value !== undefined && default_value !== null && default_value.constructor === Object) {
      if (value === undefined) {
        return default_value;
      }
    }
    throw new TypeError();
  }

  /* Returns whether the value is an object. */
  static isObject(value) {
    return (value !== undefined && value !== null && value.constructor === Object);
  }

  /* Checks whether the value is a valid JSON value. */
  static checkJSONValue(value) {
    if (value === undefined) throw new TypeError();
    if (value === null) return null;
    if ([Object, Array, String, Number, Boolean].indexOf(value.constructor) !== -1) return value;
    throw new TypeError();
  }

  /* Pads a number with zeros. */
  static padZero(total_digit_count, number) {
    const checked_total_digit_count = this.checkNumberGTE(total_digit_count, 0);
    const checked_number = this.checkNumberGTE(number, 0);
    const number_string = checked_number.toString();
    return (number_string.length < checked_total_digit_count)
      ? ('0'.repeat(checked_total_digit_count - 1) + number_string).slice(-checked_total_digit_count)
      : number_string;
  }

}

module.exports = Utils;
