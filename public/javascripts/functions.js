var http = require('http');
var request = require('request');
var Twitter = require('twitter');
var url = "23.101.233.150";
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
		sendTweets(sendTweets);
		sendTweets = [];
	}
	return sendTweets;
}

const getAnalyzer = function() {
	http.get({
		host : url,
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
			url : `http://${url}}:3030`,
			form : {text : JSON.stringify(tweetText)}
		}, function(error, response, body) {
			resolve(body);
		})
})
}

const sendTweets = function(tweetText, UID) {
		request.post({
			//url : 'http://assignment2analyzer.australiasoutheast.cloudapp.azure.com/',
			//url : 'http://10.1.0.4:3030',
			url : `http://${url}}:3030/input`,
			form : {text : JSON.stringify(tweetText), UID : UID}
		})
}

const getResults = function(UID) {
	return new Promise(resolve => {
	request.post({
		url : `http://${url}}:3030/results`,
		form : {UID : UID}
	}, function (error, response, body) {
		resolve(body);
	})

})
}

module.exports = {
	createTwitterClient,
	handleTrendResponse,
	handleStreamResponse,
	getAnalyzer,
	postTest2,
	sendTweets,
	getResults
}