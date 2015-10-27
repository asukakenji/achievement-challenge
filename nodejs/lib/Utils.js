'use strict';

class Utils {

  static checkNonEmptyString(value, defaultValue) {
    if (typeof value === 'string' && value !== '') {
      if (defaultValue === undefined || typeof defaultValue === 'string') {
        return value;
      }
    } else if (typeof defaultValue === 'string' && defaultValue !== '') {
      if (value === undefined || value === '') {
        return defaultValue;
      }
    }
    throw new TypeError();
  }

  static checkNumber(value, defaultValue) {
    if (typeof value === 'number') {
      if (defaultValue === undefined || typeof defaultValue === 'number') {
        return value;
      }
    } else if (typeof defaultValue === 'number') {
      if (value === undefined) {
        return defaultValue;
      }
    }
    throw new TypeError();
  }

  static checkArray(value, defaultValue) {
    if (value instanceof Array) {
      if (defaultValue === undefined || defaultValue instanceof Array) {
        return value;
      }
    } else if (defaultValue instanceof Array) {
      if (value === undefined) {
        return defaultValue;
      }
    }
    throw new TypeError();
  }

}

module.exports = Utils;
