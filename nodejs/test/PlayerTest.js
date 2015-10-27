'use strict';

let Player = require('../lib/Player');

describe('Player', function () {

  describe('#constructor()', function () {
    it('should be created without error', function () {
      new Player('Username', 'Password');
    });
  });

});
