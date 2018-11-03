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


let stream = {};
let count = 0;

router.post('/stream', function (req, res, next) {
	let data = req.body.trend;
	let UID = req.body.UID;
	let client = functions.createTwitterClient();
	let sendTweets = [];
	console.log("Openning Steam...");

	stream = client.stream('statuses/filter', {track: data});
	stream.on('data', function(data) {
		try {
			sendTweets.push(data.text);
			if (sendTweets.length == 20) {
				functions.sendTweets(sendTweets, UID);
				count += 20;
				//console.log(count);
				sendTweets = [];
			}
		} catch (e) {
			res.sendCode(500);
		}

	});
	stream.on('error', function(error) {
  		console.log(error);
  		res.sendCode(500);
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


router.get('/graphData', async function (req, res, next) {
	let data;
	let UID = req.query.UID;
	try {
		data = JSON.parse(await functions.getResults(UID));
		res.send(data);
	} catch(e) {
		console.log(e);
		res.sendCode(500);
	}


})

module.exports = router;