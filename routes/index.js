var express = require('express');
var router = express.Router();
var Twitter = require('twitter');

/* GET home page. */
router.get('/', function(req, res, next) {
  	res.render('index', { title: 'Twitter' });
});

module.exports = router;
