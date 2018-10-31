var express = require('express');
var Twitter = require('twitter');
var router = express.Router();
var LanguageDetect = require('languagedetect');
var lngDetector = new LanguageDetect();
var isAlphanumeric = require('is-alphanumeric');
var Sentiment = require('sentiment');
var sentiment = new Sentiment();
var natural = require('natural');
var Analyzer = require('natural').SentimentAnalyzer;
var stemmer = require('natural').PorterStemmer;
var analyzer = new Analyzer("English", stemmer, "afinn");
var tokenizer = new natural.WordTokenizer();
var azure = require('../public/javascripts/azure-storage.js');
var http = require('http');
var request = require('request');

/* GET users listing. */
router.get('/', function(req, res, next) {

  res.send('respond with a resource');
});

let tweets = [];
let tweetsNew = [];
let test = 0;
//tweets.push("test");
function storeData(data) {

}
router.post('/', function (req, res, next) {
	var client = new Twitter({
		consumer_key: 'x5SNQCc6zIJHHr5fQqeQobQt1',
		consumer_secret: 'RTs8lpgKbDpV9StCynNZPssol8wQdtKf9FyTGybKZZnZcQp05F',
		access_token_key: '1049977195853037569-mqXYZ7ONa1RT3kC2hdfM0geBCBCRq4',
		access_token_secret: 'aoo4x1sdj0RaBsYDcbBxUyiMotxSXuvzhEdAmmztaxw2J'
	});

	//filter by keyword: javascript, language en
	//more filter: https://developer.twitter.com/en/docs/tweets/filter-realtime/guides/basic-stream-parameters
	var stream = client.stream('statuses/filter', {track: 'javascript', language: 'en'});
	stream.on('data', function(data) {
  		//console.log(data);

  		let tweet = {
			Name: data.user.name,
			timestamp: parseInt(data.timestamp_ms),
			text: data.text,
			source: data.source, 
			url : data.user.profile_image_url
		}
		tweets.push(tweet);
	});
 
	stream.on('error', function(error) {
  		console.log(error);
	});
})
router.post('/hashTags', function (req, res, next) {
	var client = new Twitter({
		consumer_key: 'x5SNQCc6zIJHHr5fQqeQobQt1',
		consumer_secret: 'RTs8lpgKbDpV9StCynNZPssol8wQdtKf9FyTGybKZZnZcQp05F',
		access_token_key: '1049977195853037569-mqXYZ7ONa1RT3kC2hdfM0geBCBCRq4',
		access_token_secret: 'aoo4x1sdj0RaBsYDcbBxUyiMotxSXuvzhEdAmmztaxw2J'
	});

	azure.createTable("tabasdle");
	client.get('trends/place.json', {id : 1, language: "en"}, function (error, trends) {
		if (error) {
			console.log(error);
		}
		//console.log(trends[0]);
		let trendHashtags = [];
		for (let i = 0; i < trends[0].trends.length; i ++) {
			let trend = trends[0].trends[i].name;
			//let language  = isAlphanumeric(trend);
			trendHashtags.push(trend);
			//console.log(language);
		}
		console.log(trendHashtags);
		console.log(trendHashtags.length);
		res.json(trendHashtags);
	})

})
let stream = {};
let analyzeResults = [];
let count = 0;
let sendTweets = [];
router.post('/stream', function (req, res, next) {
	var data = req.body.trend;
	//console.log(data);
	//var tokenizer = new natural.WordTokenizer();
	//console.log(tokenizer.tokenize("your dog has fleas."));
	console.log("Openning Steam...");
	var client = new Twitter({
		consumer_key: 'x5SNQCc6zIJHHr5fQqeQobQt1',
		consumer_secret: 'RTs8lpgKbDpV9StCynNZPssol8wQdtKf9FyTGybKZZnZcQp05F',
		access_token_key: '1049977195853037569-mqXYZ7ONa1RT3kC2hdfM0geBCBCRq4',
		access_token_secret: 'aoo4x1sdj0RaBsYDcbBxUyiMotxSXuvzhEdAmmztaxw2J'
	});


	stream = client.stream('statuses/filter', {track: data});
	stream.on('data', function(data) {
		//console.log("data");
		//let text;
		//if (!data.extended_tweet) {
			//console.log(data.text);
		//	text = data.text;
		//} else {
			//console.log(data.extended_tweet.full_text);
			//text = data.extended_tweet.full_text;
		//}
			//console.log(data);
			//console.log("test");

  		//console.log(data.user.name);
  		
  		//let tweet = {
		//	Name: data.user.name,
		//	timestamp: parseInt(data.timestamp_ms),
		//	text: text,
		//	source: data.source, 
		//	url : data.user.profile_image_url
		//}
		//let result = sentiment.analyze(tweet.text);
		///tweets.push(tweet);
		//analyzeResults.push(result);
		count += 1;
		sendTweets.push(data.text);
		if (count == 20) {
			postTest(sendTweets);
			count = 0;
			//console.log(JSON.stringify(sendTweets));
			sendTweets = [];
		}
		
		//count += 1;
		//if (count == 10) {
		//	count = 0;
		//	console.log(count);

		//}
		//if (tweet.timestamp > lastSeen) {
		//	tweetsNew.push(tweet);
		//}
		//res.send("DOne!");
	});
 
	stream.on('error', function(error) {
  		console.log(error);
	});
})

router.get('/twitter', function (req, res) {
	let latestTweets = [];
	let lastSeen = req.query.lastSeen;
	//console.log(lastSeen + " time");
	if (tweets.length > 1) {
		for (let i = 0; i < tweets.length; i ++) {
			let time = tweets[i].timestamp;
			if (time > lastSeen) {
				//latestTweets.push(tweets[i]);
				//get the timestamp of the last tweet that got sent to the client side
				test = tweets[i].timestamp;
			} else {
			}
		}

		function analyseTweet(data) {
			let results = [];
			//console.log(data.length);
			for (let i = 0; i < data.length; i++) {
				let text = data[i].text;
				let result = sentiment.analyze(text);
				results.push(result);
				//console.log(result);
			}
			return results;
		}
		if (latestTweets.length > 1) {
			//console.log(latestTweets.length);
			//console.log(analyseTweet(latestTweets));
			//analyseTweet(latestTweets);
			//res.json(latestTweets);
		} else {
			res.send("None");
		}

	}
})

router.post('/stop', function (req, res, next) { 
	stream.destroy();
	console.log("Destroyed Stream");
	res.send("done!!!");
})

function getAnalyzer() {
	http.get({
		host : 'localhost',
		port : 3030,
		path :'/analyze', 
		method : 'GET'
	})
}
function postTest(tweetText) {
	return new Promise(resolve => {
		console.log(tweetText);
		request.post({
			//url : 'http://assignment2analyzer.australiasoutheast.cloudapp.azure.com/',
			//url : 'http://10.1.0.4:3030',
			url : 'http://localhost:3030',
			form : {text : JSON.stringify(tweetText)}
		}, function(error, response, body) {
			//console.log(body);
			resolve(body);
		})
})
}

function getTest() {
	return new Promise(resolve => {
	http.get({
		host : 'localhost',
		port : 3030,
		path : '/results',
		method : 'get'
	}, function (getRes) {
		let body = '';
		getRes.setEncoding('utf8');
		getRes.on('data', function (data) {
			body += data;
		})

		getRes.on('end', function (data) {
			//console.log(body);
			resolve(body);
		})
	}).on('error', function(err) {
		console.log(err);
	})
	})

}

router.get('/test', async function (req, res, next) {
	let test;
	try {
		for (let i = 1; i < 2; i++) {
			test = await getTest();
			console.log(test + " " + i);
		}
		res.send(test);
	} catch(e) {
		console.log(e);
	}


})

module.exports = router;