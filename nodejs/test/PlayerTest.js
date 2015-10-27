'use strict';

let Player = require('../routes/Player');

describe('Player', function () {

  describe('#constructor()', function () {
    it('should be created without error', function () {
      new Player('Username', 'Password');
    });
  });

});
