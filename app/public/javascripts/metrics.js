

function getMetrics(start, end) {
	return $.ajax({
		type: "POST",
		url: "/getmetrics",
		data: {startTime: start, endTime: end},
		dataType: 'JSON',
		async:false
	}).responseJSON
}
function notStopWord(word) {
	stopWords = ["task", "help", "test", "debugging", "assignment", "asdasd", "idea"]
	
	if(stopWords.indexOf(word) >= 0) {
		return false
	}
	if(word.length < 3) {
		return false
	}
	return true
} 
function weekDayChart(data) {
	var ctx = $("#weekChart").get(0).getContext("2d");
	// This will get the first returned node in the jQuery collection.
	var myNewChart = new Chart(ctx);
	var weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
	var today = new Date()
	var lastweek = [0,0,0,0,0,0,0]
	for (var i = 0; i < data.length; i++) {
		if(data[i].andrewId !="jingzew") {
			date = new Date(data[i].timestamp)
			var timediff =today.getTime() - date.getTime()
			var oneweek = 7 *24 * 60 * 60 * 1000
			if(timediff < 100 * oneweek) {
				lastweek[date.getDay()] += 1
			}			
		}
	}
	
	var dataPoints = {
    labels: weekdays,
    datasets: [
        {
            label: "Last week",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            data: lastweek
        },
        
        ]
    };
    myNewChart.Bar(dataPoints)


}

$(document).ready(function() {
	endTime = new Date()
	startTime = new Date(2015, 0, 1)
	
	data = getMetrics(startTime.getTime(), endTime.getTime())
	dataByAndrewId = {}
	var problems = []
	var words = {}
	today = new Date()
	for(var i = 0; i < data.length; i++) {
		if(data[i].andrewId !="jingzew") {
			if(dataByAndrewId[data[i].andrewId] === undefined) {
				dataByAndrewId[data[i].andrewId] = 1

			}
			else {
				dataByAndrewId[data[i].andrewId] += 1
			}

			date = new Date(data[i].timestamp)
			var timediff =today.getTime() - date.getTime()
			var oneweek = 7 *24 * 60 * 60 * 1000
			if(timediff < 2 * oneweek) {
				problems.push({word: data[i].problem})
				problemWords = data[i].problem.trim().toLowerCase().split(' ')
				for (var word in problemWords) {
					if(notStopWord(problemWords[word])) {
						if(words[problemWords[word]] === undefined) {
								words[problemWords[word]] = 0
						}
						words[problemWords[word]] += 1
					}
				}
			}
		}
	}

	var sortableWords = []
	for (var word in words) {
		sortableWords.push([word, words[word]]) 
	}
	sortableWords.sort(function(a,b) {return b[1] - a[1]})

	var sortable = [];
	for (var student in dataByAndrewId)
    	sortable.push([student, dataByAndrewId[student]])
    sortable.sort(function(a, b) {return b[1] - a[1]})

    console.log(sortableWords)
    
    commonIds = ' <ul class="collection"> '
	
    var options = {
    	keys : ['word']
    }
    var f = new Fuse(problems, options)

	for(var i = 0; i < 7; i++) {
		commonIds += "<li class='collection-item'>"
		commonIds += sortable[i][0]
		commonIds += '<span class="badge">'
		commonIds += sortable[i][1]
		commonIds += '</span></li>'
	}
	commonIds += "</ul>"


   	commonIds += '<h5> The most common words in the corpus are</h5> <ul class="collection"> '
	
	for(var i = 0; i < 10; i++) {
		var len = f.search(sortableWords[i][0]).length
		if(notStopWord(sortableWords[i][0]))
			console.log("good")
		if(len > 3) {
			commonIds += "<li class='collection-item'>"
			commonIds += sortableWords[i][0]
			commonIds += '<span class="badge">'
			commonIds +=  len
			commonIds += '</span></li>'
		}
	}
	commonIds += "</ul>"
	$("#mostCommonIds").html(commonIds)

	weekDayChart(data)
	
 });
