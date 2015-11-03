'use strict';

const Utils = require('../lib/Utils');
const assert = require('assert');

describe('Utils', function () {

  //                    default
  // id    value        Value        result
  // --    ---------    ---------    ---------
  // 01    undefined    undefined    TypeError
  // 02    undefined    {}           TypeError
  // 03    undefined    ''           TypeError
  // 04    undefined    'YYY'        'YYY'
  // 05    {}           undefined    TypeError
  // 06    {}           {}           TypeError
  // 07    {}           ''           TypeError
  // 08    {}           'YYY'        TypeError
  // 09    ''           undefined    TypeError
  // 10    ''           {}           TypeError
  // 11    ''           ''           TypeError
  // 12    ''           'YYY'        'YYY'
  // 13    'XXX'        undefined    'XXX'
  // 14    'XXX'        {}           TypeError
  // 15    'XXX'        ''           'XXX'
  // 16    'XXX'        'YYY'        'XXX'
  describe('#checkNonEmptyString()', function () {
    it('should throw TypeError when called with zero argument', function () {
      // 01
      assert.throws(() => Utils.checkNonEmptyString(), TypeError);
    });
    it('should throw TypeError when called with non-string defaultValue', function () {
      // 02
      assert.throws(() => Utils.checkNonEmptyString(undefined, {}), TypeError);
      // 14
      assert.throws(() => Utils.checkNonEmptyString('XXX', {}), TypeError);
    });
    it('should throw TypeError when called with empty string defaultValue', function () {
      // 03
      assert.throws(() => Utils.checkNonEmptyString(undefined, ''), TypeError);
    });
    it('should throw TypeError when called with non-string value', function () {
      // 05 ~ 08
      assert.throws(() => Utils.checkNonEmptyString({}), TypeError);
      assert.throws(() => Utils.checkNonEmptyString({}, {}), TypeError);
      assert.throws(() => Utils.checkNonEmptyString({}, ''), TypeError);
      assert.throws(() => Utils.checkNonEmptyString({}, 'YYY'), TypeError);
    });
    it('should throw TypeError when called with empty string value', function () {
      // 09 ~ 11
      assert.throws(() => Utils.checkNonEmptyString(''), TypeError);
      assert.throws(() => Utils.checkNonEmptyString('', {}), TypeError);
      assert.throws(() => Utils.checkNonEmptyString('', ''), TypeError);
    });
    it('should throw no error if either value or defaultValue works', function () {
      // 04
      assert.strictEqual(Utils.checkNonEmptyString(undefined, 'YYY'), 'YYY');
      // 12
      assert.strictEqual(Utils.checkNonEmptyString('', 'YYY'), 'YYY');
      // 13
      assert.strictEqual(Utils.checkNonEmptyString('XXX'), 'XXX');
      // 15
      assert.strictEqual(Utils.checkNonEmptyString('XXX', ''), 'XXX');
      // 16
      assert.strictEqual(Utils.checkNonEmptyString('XXX', 'YYY'), 'XXX');
    });
  });

  //                    default
  // id    value        Value        result
  // --    ---------    ---------    ---------
  // 01    undefined    undefined    TypeError
  // 02    undefined    {}           TypeError
  // 03    undefined    42           42
  // 04    {}           undefined    TypeError
  // 05    {}           {}           TypeError
  // 06    {}           42           TypeError
  // 07    24           undefined    24
  // 08    24           {}           TypeError
  // 09    24           42           24
  describe('#checkNumber()', function () {
    it('should throw TypeError when called with zero argument', function () {
      // 01
      assert.throws(() => Utils.checkNumber(), TypeError);
    });
    it('should throw TypeError when called with non-number defaultValue', function () {
      // 02
      assert.throws(() => Utils.checkNumber(undefined, {}), TypeError);
      // 08
      assert.throws(() => Utils.checkNumber(24, {}), TypeError);
    });
    it('should throw TypeError when called with non-number value', function () {
      // 04 ~ 06
      assert.throws(() => Utils.checkNumber({}), TypeError);
      assert.throws(() => Utils.checkNumber({}, {}), TypeError);
      assert.throws(() => Utils.checkNumber({}, 42), TypeError);
    });
    it('should throw no error if either value or defaultValue works', function () {
      // 03
      assert.strictEqual(Utils.checkNumber(undefined, 42), 42);
      // 07
      assert.strictEqual(Utils.checkNumber(24, undefined), 24);
      // 09
      assert.strictEqual(Utils.checkNumber(24, 42), 24);
    });
  });

  //                    default
  // id    value        Value        result
  // --    ---------    ---------    ---------
  // 01    undefined    undefined    TypeError
  // 02    undefined    {}           TypeError
  // 03    undefined    [42]         [42]
  // 04    {}           undefined    TypeError
  // 05    {}           {}           TypeError
  // 06    {}           [42]         TypeError
  // 07    [24]         undefined    [24]
  // 08    [24]         {}           TypeError
  // 09    [24]         [42]         [24]
  describe('#checkArray()', function () {
    it('should throw TypeError when called with zero argument', function () {
      // 01
      assert.throws(() => Utils.checkArray(), TypeError);
    });
    it('should throw TypeError when called with non-array defaultValue', function () {
      // 02
      assert.throws(() => Utils.checkArray(undefined, {}), TypeError);
      // 08
      assert.throws(() => Utils.checkArray([24], {}), TypeError);
    });
    it('should throw TypeError when called with non-array value', function () {
      // 04 ~ 06
      assert.throws(() => Utils.checkArray({}), TypeError);
      assert.throws(() => Utils.checkArray({}, {}), TypeError);
      assert.throws(() => Utils.checkArray({}, [42]), TypeError);
    });
    it('should throw no error if either value or defaultValue works', function () {
      // 03
      assert.deepStrictEqual(Utils.checkArray(undefined, [42]), [42]);
      // 07
      assert.deepStrictEqual(Utils.checkArray([24], undefined), [24]);
      // 09
      assert.deepStrictEqual(Utils.checkArray([24], [42]), [24]);
    });
  });

  //       total
  //       Digit
  // id    Count        number       result
  // --    ---------    ---------    ---------
  // 01    undefined    undefined    TypeError
  // 02    {}           undefined    TypeError
  // 03    0            undefined    TypeError
  // 04    {}           {}           TypeError
  // 05    {}           0            TypeError
  // 06    0            {}           TypeError
  // 07    -1           0            RangeError
  // 08    0            -1           RangeError
  // 09    0            0            0
  // 10    0            10           10
  // 11    0            100          100
  // 12    1            0            0
  // 13    1            10           10
  // 14    1            100          100
  // 15    2            0            00
  // 16    2            10           10
  // 17    2            100          100
  // 18    3            0            000
  // 19    3            10           010
  // 20    3            100          100
  describe('#padZero()', function () {
    it('should throw TypeError', function () {
      // 01 ~ 06
      assert.throws(() => Utils.padZero(), TypeError);
      assert.throws(() => Utils.padZero({}), TypeError);
      assert.throws(() => Utils.padZero(0), TypeError);
      assert.throws(() => Utils.padZero({}, {}), TypeError);
      assert.throws(() => Utils.padZero({}, 0), TypeError);
      assert.throws(() => Utils.padZero(0, {}), TypeError);
    });
    it('should throw RangeError', function () {
      // 07 ~ 08
      assert.throws(() => Utils.padZero(-1, 0), RangeError);
      assert.throws(() => Utils.padZero(0, -1), RangeError);
    });
    it('should work correctly when totalDigitCount === 0', function () {
      // 09 ~ 11
      assert.strictEqual(Utils.padZero(0, 0), '0');
      assert.strictEqual(Utils.padZero(0, 10), '10');
      assert.strictEqual(Utils.padZero(0, 100), '100');
    });
    it('should work correctly when totalDigitCount === 1', function () {
      // 12 ~ 14
      assert.strictEqual(Utils.padZero(1, 0), '0');
      assert.strictEqual(Utils.padZero(1, 10), '10');
      assert.strictEqual(Utils.padZero(1, 100), '100');
    });
    it('should work correctly when totalDigitCount === 2', function () {
      // 15 ~ 17
      assert.strictEqual(Utils.padZero(2, 0), '00');
      assert.strictEqual(Utils.padZero(2, 10), '10');
      assert.strictEqual(Utils.padZero(2, 100), '100');
    });
    it('should work correctly when totalDigitCount === 3', function () {
      // 18 ~ 20
      assert.strictEqual(Utils.padZero(3, 0), '000');
      assert.strictEqual(Utils.padZero(3, 10), '010');
      assert.strictEqual(Utils.padZero(3, 100), '100');
    });
  });

});
