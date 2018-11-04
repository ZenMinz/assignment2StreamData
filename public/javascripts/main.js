//Global variable
	let UID;
//Global Functions which are called by the form's elements
	//Function to get the trending HashTags
	window.getHashTags = function () {
		$("#streamBTN").prop('disabled', false);
		$("#pauseBTN").prop('disabled', true);
		$.post('/twitter/hashTags', function (data) {
			displayHashTags(data);
			UID = createUID();
			tweets = data;
		}).fail(function() {
			alert("No data");
		});
	}

	//Function to get selected tags and send them to server side
	window.streamData = function () {

		let selected = [];
		for (let i = 0; i < tweets.length; i++) {
			if ($(`#check${i+1}`).is(":checked")) {
				selected.push(tweets[i]);
			}
		}
		let length = selected.length;
		let str = selected.join(',');
		if (length > 0) {
			$("#streamBTN").prop('disabled', true);
			$("#pauseBTN").prop('disabled', false);
			sendStreamRequest(str);
		} else {
			alert("Please select at least a tag to start.")
		}
		
	}

	//Function to stop the opening stream
	window.stopStream = function () {
		$("#streamBTN").prop('disabled', false);
		$("#pauseBTN").prop('disabled', true);
		$.post('/twitter/stop', function(data) {
			clearInterval(interval);
		}).fail(function() {
			alert("No Steam running :(")
		});
	}

//Functions
	//Function to display trending HashTag
	function displayHashTags(data) {
		$(".tagInput").empty();
		let str2 = `<div class="ui left aligned grid">`;
		for (let i = 0; i < data.length; i ++) {
			str2 += `<div class="four wide column">`;
			str2 += `	<div class="ui toggle checkbox">
							<input type="checkbox" id=check${i + 1}>
							<label>${data[i]}</label>
						</div>`;
			str2 += `</div>`;
		}
		str2 += `</div>`;
		$(".tagInput").append(str2);
		}

	//Function to send stream request to server side
	function sendStreamRequest(trend) {
		$.post('/twitter/stream', {'trend': trend, "UID" : UID}, function (data) {
		}).fail(function() {
			//alert("Twitter API does not work :(")
		})
	}

	//Function to display graph or update graph if a graph is existed.
	function displayGraph() {
		let svg = d3.select("svg > g");
		$.get('/twitter/graphData', {"UID" : UID}, function (data) {
			if (data != "Error") {


			if (svg.empty()) {
				buildGraph(data);
			} else {
				updateGraph(data);
			}
		}
			$(".dimmer").hide();
			$("body").css("overflow", "auto");
			setTimeout(displayGraph, 5000);
		}).fail(function() {
			alert("Could not get data from database :(");
			$(".dimmer").hide();
			$("body").css("overflow", "auto");
		})
	}

	//Function to update Graph
	function updateGraph(data) {
		pie.updateProp("data.content", data);
	}

	//Function create Graph
	function buildGraph(data) {
		try {
		pie = new d3pie("pie", {
			"header": {
				"title": {
					"text": "Reaction"
				},
				"location": "pie-center"
			},
			"size": {
				"canvasWidth" : 800,
				"canvasHeight" : 800,
				"pieInnerRadius": "70%",
				"pieOuterRadius": "85%"
			},
			"data" : {
				"content": data
			},
			"labels" : {
				"mainLabel" : {
					"fontSize" : 20
				},
				"value" : {
					"fontSize" : 15
				},
				"percentage" : {
					"fontSize" : 20,
					"color": "#ffffff"
				},
				"inner" : {
					"format" : "percentage"
				}
			}				
		});
		} catch(e) {
			alert("Something has gone wrong with d3pie library :(")
		}
	}
	//Function to generate unique ID
	function createUID() {
		let seed = Date.now();
		let number = Math.floor(Math.random(seed) * 32) + Date.now();
		return number;
	}
//Main script
$(document).ready(function() {
	$("body").css("overflow", "hidden");
	$('.dimmer').show();
	//Global variables
	let tweets;
	let pie;
	UID = createUID();
	//Display hastags and graph
	getHashTags();
	displayGraph();
})