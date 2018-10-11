var express = require('express');
var Twitter = require('twitter');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

  res.send('respond with a resource');
});

let tweets = [];
let test = 0;
//tweets.push("test");

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
  		//console.log(event);

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

router.get('/twitter', function (req, res) {
	let latestTweets = [];
	let lastSeen = req.query.lastSeen;
	console.log("lastSeen " + test);
	console.log("lastSeen (parsed) " + Date.parse(test));
	if (tweets.length > 1) {
		for (let i = 0; i < tweets.length; i ++) {
			let time = tweets[i].timestamp;
			if (time > test) {
				latestTweets.push(tweets[i]);
				//get the timestamp of the last tweet that got sent to the client side
				test = tweets[i].timestamp;
			} else {
			}
		}
		res.json(latestTweets);
	}
})
module.exports = router;