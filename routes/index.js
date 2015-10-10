'use strict';

let express = require('express');
let router = express.Router();

router.get('/', function (req, res, next) {
  res.redirect(302, '/main.html');
});

module.exports = router;
