var express = require('express');
var router = express.Router();

var slug = require('slug');
var redis = require("redis");
var client = redis.createClient();

client.on("error", function (err) {
  console.log("Error " + err);
});


/* GET home page. */
router.get('/rooms', function (req, res) {
  client.keys('rooms:*', function (err, results) {
    res.json(results);
  });
});

router.post('/rooms', function (req, res) {
  var name = req.body['name'];
  var key = 'rooms:' + slug(name).toLowerCase();

  client.exists(key, function (err, exists) {
    if (exists) {
      res.status(400);
      res.json({error: 'name already taken'});
    }
    else {
      client.hset(key, 'name', name, function (err, results) {
        res.json({status: 'ok'});
      });
    }
  });
});

module.exports = router;

