var express = require('express');
var Twitter = require('twitter');
var router = express.Router();
var functions = require('../public/javascripts/functions.js');
var http = require('http');
var request = require('request');


router.post('/hashTags', function (req, res, next) {
	let client = functions.createTwitterClient();
	client.get('trends/place.json', {id : 1}, function (error, trends) {
		if (error) {
			res.sendCode(500);
		} else {
			try {
				res.json(functions.handleTrendResponse(trends));
			} catch(e) {
				console.log(e);
				res.sendCode(500);
			}
		}
	})
})


let stream;

router.post('/stream', function (req, res, next) {
	let data = req.body.trend;
	let UID = req.body.UID;
	let client = functions.createTwitterClient();
	let sendTweets = [];
	console.log("Openning Steam...");
	if (stream) {
		stream.destroy();
	}
	stream = client.stream('statuses/filter', {track: data});
	stream.on('data', function(data) {
		try {
			sendTweets.push(data.text);
			if (sendTweets.length == 20) {
				functions.sendTweets(sendTweets, UID);
				sendTweets = [];
			}
		} catch (e) {
			res.sendCode(500);
		}

	});
	stream.on('error', function(error) {
  		console.log(error);
  		res.send("error");
	});
})


router.post('/stop', function (req, res, next) {
	try {
		stream.destroy();
		console.log("Destroyed Stream");	
	} catch (e) {
		res.sendCode(500);
	}
})


router.get('/graphData', function (req, res, next) {
	let data;
	let UID = req.query.UID;
	try {
		functions.getResults(UID, res);
	} catch(e) {
		console.log(e);
		res.sendCode(500);
	}


})

module.exports = router;