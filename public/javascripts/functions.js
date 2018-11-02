var http = require('http');
var request = require('request');
var Twitter = require('twitter');
const createTwitterClient = function() {
	let client = new Twitter({
		consumer_key: 'x5SNQCc6zIJHHr5fQqeQobQt1',
		consumer_secret: 'RTs8lpgKbDpV9StCynNZPssol8wQdtKf9FyTGybKZZnZcQp05F',
		access_token_key: '1049977195853037569-mqXYZ7ONa1RT3kC2hdfM0geBCBCRq4',
		access_token_secret: 'aoo4x1sdj0RaBsYDcbBxUyiMotxSXuvzhEdAmmztaxw2J'
	});
	return client;
}

const handleTrendResponse = function(trends) {
	let trendHashtags = [];
	for (let i = 0; i < trends[0].trends.length; i ++) {
		let trend = trends[0].trends[i].name;
		trendHashtags.push(trend);
	}
	console.log(trendHashtags);
	return trendHashtags;
}

const handleStreamResponse = function(data, sendTweets) {
	sendTweets.push(data.text);
	if (sendTweets.length == 20) {
		postTest(sendTweets);
		console.log(sendTweets);
		sendTweets = [];
	}
	return sendTweets;
}

const getAnalyzer = function() {
	http.get({
		host : 'localhost',
		port : 3030,
		path :'/analyze', 
		method : 'GET'
	})
}

const postTest2 = function(tweetText) {
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

const postTest = function(tweetText) {
		request.post({
			//url : 'http://assignment2analyzer.australiasoutheast.cloudapp.azure.com/',
			//url : 'http://10.1.0.4:3030',
			url : 'http://localhost:3030',
			form : {text : JSON.stringify(tweetText)}
		})
}

const getResults = function() {
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
			resolve(body);
		})

	}).on('error', function(err) {
		console.log(err);
	})
	})

}

module.exports = {
	createTwitterClient,
	handleTrendResponse,
	handleStreamResponse,
	getAnalyzer,
	postTest2,
	postTest,
	getResults
}