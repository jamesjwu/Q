var CONSTANTS = {
    semesterStart: new Date('2016-01-01'),
    semesterEnd: new Date()
};

/* Ajax to get the data */
function getMetrics(start, end) {
	return $.ajax({
		type: 'POST',
		url: '/getmetrics',
		data: {startTime: start, endTime: end},
		dataType: 'JSON',
	}).done(function(data) {
        if (data.length > 0) {
            mostCommonIds(data);
            loadPerWeekChart(data);
            weekDayChart(data, 2); // load weekday data for the last 2 weeks
        }
    });
}

/* Gets rid of useless words for most common problems */
function notStopWord(word) {
	stopWords = ['task', 'help', 'the', 'test', 'debugging', 'assignment',
                 'asdasd', 'idea', 'more', 'ropes', 'rope', 'out'];

	if (stopWords.indexOf(word) >= 0) {
		return false;
	}
	if (word.length < 3) {
		return false;
	}
	return true;
}

/* Load number of requests per assignment */
function loadPerWeekChart(data) {
	assignments = {1: 'Scavhunt', 2 : 'Scavhunt', 3: 'Pixels', 4: 'Images', 5: 'Doslingos',
					6: 'Clac', 7: 'Clac', 8: 'Editor', 9: 'Editor',
					10: 'Ropes',
					11: 'Strbuf', 12: 'Strbuf',
					13: 'Lightsout', 14 : 'C0VM (checkpoint)', 15: 'C0VM'};

	startTime = CONSTANTS.semesterStart;
	weeks = {};
	var oneweek = 7 * 24 * 60 * 60 * 1000;
	for (var student in data) {
		var date = data[student].timestamp;

		var diff = date - startTime.getTime();
		var week = Math.floor(diff / oneweek);
		if (weeks[assignments[week]] === undefined) {
			weeks[assignments[week]] = 0;
		}
		weeks[assignments[week]] += 1;
	}

	var ctx = $('#assignmentChart').get(0).getContext('2d');
	var myNewChart = new Chart(ctx);
	var dataPoints = {
    labels: Object.keys(weeks),
    datasets: [
        {
            label: 'Assignments',
            fillColor: 'rgba(98,214,107,0.2)',
            strokeColor: 'rgba(98,214,107,1)',
            pointColor: 'rgba(98,214,107,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: 'rgba(98,214,107, 1)',
            pointHighlightStroke: 'rgba(98,214,107, 1)',
            data: weeks
        },

        ],

    };
    myNewChart.Bar(dataPoints);
}

/* Load number of requests per day in last n weeks */
function weekDayChart(data, weeks) {
	var ctx = $('#weekChart').get(0).getContext('2d');
	// This will get the first returned node in the jQuery collection.
	var myNewChart = new Chart(ctx);
	var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	var today = new Date();
	var lastweek = [0, 0, 0, 0, 0, 0, 0];
	for (var i = 0; i < data.length; i++) {
		if (data[i].andrewId != 'jingzew') {
			date = new Date(data[i].timestamp);
			var timediff = today.getTime() - date.getTime();
			var oneweek = 7 * 24 * 60 * 60 * 1000;
			if (timediff <= weeks * oneweek) {
				lastweek[date.getDay()] += 1;
			}
		}
	}

	var dataPoints = {
    labels: weekdays,
    datasets: [
        {
            label: 'Last week',
            fillColor: 'rgba(220,220,220,0.2)',
            strokeColor: 'rgba(220,220,220,1)',
            pointColor: 'rgba(220,220,220,1)',
            pointStrokeColor: '#fff',
            pointHighlightFill: '#fff',
            pointHighlightStroke: 'rgba(220,220,220,1)',
            data: lastweek
        },

        ]
    };
    myNewChart.Bar(dataPoints);


}

/* Get most common office hour users */
function mostCommonIds(data) {
	dataByAndrewId = {};
	var problems = [];
	var words = {};
	today = new Date();
	for (var i = 0; i < data.length; i++) {
		if (data[i].andrewId != 'jingzew') {
			if (dataByAndrewId[data[i].andrewId] === undefined) {
				dataByAndrewId[data[i].andrewId] = 1;

			}
			else {
				dataByAndrewId[data[i].andrewId] += 1;
			}

			date = new Date(data[i].timestamp);
			var timediff = today.getTime() - date.getTime();
			var oneweek = 7 * 24 * 60 * 60 * 1000;

			problems.push({word: data[i].problem});
			problemWords = data[i].problem.trim().toLowerCase().split(' ');
			for (var word in problemWords) {
				if (notStopWord(problemWords[word])) {
					if (words[problemWords[word]] === undefined) {
							words[problemWords[word]] = 0;
					}
					words[problemWords[word]] += 1;
				}
			}

		}
	}

	var sortableWords = [];
	for (var word in words) {
		sortableWords.push([word, words[word]]);
	}
	sortableWords.sort(function(a, b) {return b[1] - a[1]});

	var sortable = [];
	for (var student in dataByAndrewId)
    	sortable.push([student, dataByAndrewId[student]]);
    sortable.sort(function(a, b) {return b[1] - a[1]});


    commonIds = ' <ul class="collection"> ';

    var options = {
    	keys: ['word']
    };

    // fuzzy search
    var f = new Fuse(problems, options);

	for (var i = 0; i < Math.min(7, sortable.length); i++) {
		commonIds += "<li class='collection-item'>";
		commonIds += sortable[i][0];
		commonIds += '<span class="badge">';
		commonIds += sortable[i][1];
		commonIds += '</span></li>';
	}
	commonIds += '</ul>';


   	commonIds += '<h5> The most common words in the corpus are</h5> <ul class="collection"> ';
	for (var i = 0; i < Math.min(10, sortableWords.length); i++) {
		var len = f.search(sortableWords[i][0]).length;
		if (len > 3) {
			commonIds += "<li class='collection-item'>";
			commonIds += sortableWords[i][0];
			commonIds += '<span class="badge">';
			commonIds += len;
			commonIds += '</span></li>';
		}
	}

	commonIds += '</ul>';
	$('#mostCommonIds').html(commonIds);


}
$(document).ready(function() {
    lastChecked = localStorage.metricsTimeStamp;
	endTime = CONSTANTS.semesterEnd;
	startTime = CONSTANTS.semesterStart;
    getMetrics(startTime.getTime(), endTime.getTime());
 });
