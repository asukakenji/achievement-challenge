'use strict';

class Utils {

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

  static checkNumberGT(value, reference_value, default_value) {
    const checked_value = this.checkNumber(value, default_value);
    const checked_reference_value = this.checkNumber(reference_value);
    if (checked_value > checked_reference_value) return checked_value;
    throw new RangeError();
  }

  static checkNumberGTE(value, reference_value, default_value) {
    const checked_value = this.checkNumber(value, default_value);
    const checked_reference_value = this.checkNumber(reference_value);
    if (checked_value >= checked_reference_value) return checked_value;
    throw new RangeError();
  }

  static checkNumberLT(value, reference_value, default_value) {
    const checked_value = this.checkNumber(value, default_value);
    const checked_reference_value = this.checkNumber(reference_value);
    if (checked_value < checked_reference_value) return checked_value;
    throw new RangeError();
  }

  static checkNumberLTE(value, reference_value, default_value) {
    const checked_value = this.checkNumber(value, default_value);
    const checked_reference_value = this.checkNumber(reference_value);
    if (checked_value <= checked_reference_value) return checked_value;
    throw new RangeError();
  }

  static checkArray(value, default_value) {
    if (value instanceof Array) {
      if (default_value === undefined || default_value instanceof Array) {
        return value;
      }
    } else if (default_value instanceof Array) {
      if (value === undefined) {
        return default_value;
      }
    }
    throw new TypeError();
  }

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
