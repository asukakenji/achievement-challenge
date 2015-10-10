'use strict';

// TODO: Should be moved to somewhere else:
let url = 'mongodb://localhost:27017/achievement_challenge';

let express = require('express');
let router = express.Router();

let body_parser = require('body-parser');
let urlencoded_parser = body_parser.urlencoded({ extended: false });

let co_express = require('co-express');

let mongodb = require('mongodb');
//let co_mongodb = require('co-mongodb');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.redirect(302, '/main.html');
});

/* POST login page */
router.post('/login', urlencoded_parser, co_express(login));

/* Helper functions */
function s0(value) {
	return JSON.stringify(value);
}

function s4(value) {
	return JSON.stringify(value, null, 4);
}

function* login(req, res, next) {
  if (!req.body) return res.sendStatus(400);
  let username = req.body.username;
  let password = req.body.password;

  let db = yield (callback) => mongodb.MongoClient.connect(url, callback);
  //let db = yield co_mongodb.MongoClient.connect(url);
  console.log('Connected');

  let collection = yield (callback) => db.collection('users', callback);
  //let collection = co_mongodb.db.collection(db, 'users');
  console.log('Collection obtained');

  let query = { username };
  console.log('query: ' + JSON.stringify(query));

  let cursor = yield (callback) => collection.find(query, callback);  // ???: mongodb source different from documentation
  //let cursor = co_mongodb.collection.find(collection, query);
  console.log('Cursor obtained');

  let count = yield (callback) => cursor.count(callback);  // ???: mongodb source different from documentation
  //let count = co_mongodb.cursor.count(cursor);
  console.log('Count obtained');

  if (count === 0) {
    // Empty
    console.log('User Not Found');

    let user = { username, password };
    console.log('user: ' + s4(user));

    let insertResult = yield (callback) => collection.insertOne(user, callback);
    //let insertResult = co_mongodb.collection.insertOne(collection, user);
    console.log('Inserted: ' + s4(insertResult));

    if (insertResult.result.ok === 1 && insertResult.result.n === 1) {
      let message = {
        'errorCode': 1,
        'url': '/game.html',
        'token': '1234567890ABCDEF'
      };
      console.log('message: ' + s4(message));
      console.log('--------');
      console.log();
      res.send(message);
    } else {
      let message = {
        'errorCode': -2
      };
      console.log('message: ' + s4(message));
      console.log('--------');
      console.log();
      res.send(message);
    }
  } else {
    // Non-empty
    console.log('User Found');

    let user = yield (callback) => cursor.next(callback);
    //let user = co_mongodb.cursor.next(cursor);
    console.log('User Obtained: ' + s4(user));

    if (user.password === password) {
      let message = {
        'errorCode': 0,
        'url': '/game.html',
        'token': '1234567890ABCDEF'
      };
      console.log('message: ' + s4(message));
      console.log('--------');
      console.log();
      res.send(message);
    } else {
      let message = {
        'errorCode': -1
      };
      console.log('message: ' + s4(message));
      console.log('--------');
      console.log();
      res.send(message);
    }
  }

  yield (callback) => cursor.close(callback);
  yield (callback) => db.close(false, callback);
}

module.exports = router;
