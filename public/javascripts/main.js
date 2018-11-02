//Function
	function stopStream() {
		$.post('/twitter/stop', function(data) {
			clearTimeout(interval);
		});
	}

	function getHashTags() {
		$.post('/twitter/hashTags', function (data) {
			displayHashTags(data);
			tweets = data;
		})
	}

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

	function sendStreamRequest(trend) {
		$.post('/twitter/stream', {'trend': trend}, function (data) {
		})
	}

	function streamData() {
		let selected = [];
		for (let i = 0; i < tweets.length; i++) {
			if ($(`#check${i+1}`).is(":checked")) {
				selected.push(tweets[i]);
			}
		}
		let length = selected.length;
		let str = selected.join(',');
		sendStreamRequest(str);
	}

	function displayGraph() {
		let svg = d3.select("svg > g");
		$.get('/twitter/test', function (data) {
			if (svg.empty()) {
				buildGraph(data);
			} else {
				updateGraph(data);
			}
		})
	}

	function updateGraph(data) {
		pie.updateProp("data.content", data);
	}

	function buildGraph(data) {
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
				"pieOuterRadius": "90%"
			},
			"data" : {
				"content": data
			},
			"labels" : {
				"mainLabel" : {
					"fontSize" : 20
				},
				"percentage" : {
					"fontSize" : 15
				}
			}				
		});
	}

$(document).ready(function() {
	let interval;
	let tweets;
	let pie;
	getHashTags();
	displayGraph();
	interval = setInterval(displayGraph, 10000);
})