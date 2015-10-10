'use strict';

let express = require('express');
let router = express.Router();

let bodyParser = require('body-parser');
let urlencodedParser = bodyParser.urlencoded({ extended: false });

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect(302, '/main.html');
});

/* POST login page */
router.post('/login', urlencodedParser, function (req, res, next) {
  if (!req.body) return res.sendStatus(400)
  let username = req.body.username;
  let password = req.body.password;
  if (username === 'kenji' && password === '123') {
    let message = {
      "errorCode": 0,
      "url": "/game.html",
      "token": "1234567890ABCDEF"
    };
    res.send(message);
  } else {
    let message = {
      "errorCode": 1
    };
    res.send(message);
  }
});

module.exports = router;
