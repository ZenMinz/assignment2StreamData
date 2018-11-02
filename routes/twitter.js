var express = require('express');
var Twitter = require('twitter');
var router = express.Router();
var functions = require('../public/javascripts/functions.js')
var http = require('http');
var request = require('request');


router.post('/hashTags', function (req, res, next) {
	console.log(req);
	let client = functions.createTwitterClient();
	client.get('trends/place.json', {id : 1}, function (error, trends) {
		if (error) {
			console.log(error);
		} else {
			try {
				console.log(2);
				res.json(functions.handleTrendResponse(trends));
			} catch(e) {
				console.log(e);
				res.send('error');
			}
		}
	})
})


let stream = {};
//let analyzeResults = [];
//let count = 0;
//let sendTweets = [];


router.post('/stream', function (req, res, next) {
	let data = req.body.trend;
	let client = functions.createTwitterClient();
	let count = 0;
	let sendTweets = [];
	console.log("Openning Steam...");

	stream = client.stream('statuses/filter', {track: data});
	stream.on('data', function(data) {
		sendTweets.push(data.text);
		if (sendTweets.length == 20) {
			functions.postTest(sendTweets);
			console.log(sendTweets);
			sendTweets = [];
	}
	});
 
	stream.on('error', function(error) {
  		console.log(error);
	});
})


router.post('/stop', function (req, res, next) { 
	stream.destroy();
	console.log("Destroyed Stream");
})


router.get('/test', async function (req, res, next) {
	let test;
	try {
		for (let i = 1; i < 2; i++) {
			test = JSON.parse(await functions.getResults());
		}
		res.send(test);
	} catch(e) {
		console.log(e);
	}


})

module.exports = router;