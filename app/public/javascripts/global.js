// TODO: Global vairable is bad
var userListData = []; 


$(document).ready(function() {
    populateTable();
    $('#btnAddUser').on('click', addUser);
    $('#addUser input').on('change', resetInput);
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
    
});

//sets the help time div to the correct number
function setAverageHelpTime() {
    console.log(getAverageHelpTime())
    $('#averageHelpTime h3').html(Math.round(getAverageHelpTime()) + " minute(s)")
}

function resetInput(event) {
    event.preventDefault();
    $(this).css("border-color", "initial")
}

// calculate the amount of time it took the person to get helped
function getTimeHelped(time) {
    // in minutes
    return (new Date().getTime() - time) / 1000 / 60;
}


// calculate average help time
function getAverageHelpTime() {
    // get all the help times stored in localStorage
    var helptimes = localStorage.helpTimes.trim().split("\n");
    var sum = 0.0

    for(var i = 0; i < helptimes.length; i++) {
        if(helptimes[i] != "") {
            sum += parseFloat(helptimes[i])
        }
    }

    //take the average help time length, and multiply by how many people are in the queue
    return sum/(helptimes.length) * userListData.length;  

}

//on the event of a delete, we calculate how long it took the person to get helped
function deleteUser(event) {
    event.preventDefault();
    var time = $(this).attr('time')
    console.log("This person took " + getTimeHelped(time) + " minutes to get helped");
    // only consider cases when time took more than one minute
    if(getTimeHelped(time) >= 1.0) {
        localStorage.helpTimes += getTimeHelped(time)  + "\n"
    }   

    $.ajax({
        type: "DELETE",
        url: "/users/deleteuser/"+$(this).attr('rel')
    }).done(function(response) {
        if (response.msg === '') {
        } else {
            alert('Error: ' + response.msg);
        }
        //update table
        populateTable();
    });

}

function addUser(event) {
    event.preventDefault();

    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if ($(this).val() === '') {
            $(this).css("border-color", "#ff5722")
            errorCount++
        };
    });

    if (errorCount === 0) {
        var newUser = {
            'name': $('#addUser fieldset input#inputUserName').val(),
            'andrewId': $('#addUser fieldset input#inputUserAndrewId').val(),
            'problem': $('#addUser fieldset input#inputUserProblem').val(),
            'timestamp': new Date().getTime()
        }
        $.ajax({
            type: "POST",
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function(response) {
            if (response.msg === '') {
                $('#addUser fieldset input#inputUserProblem').val('')               
                populateTable();
            } else {
                alert('Error: ' + response.msg);
            }
        });
    } else {
        return false;
    }
}

function populateTable() {
    var tableContent = '';

    // jQuery AJAX call for JSON
    $.getJSON('/users/userlist', function(data) {
        userListData = data;

        $.each(data, function() {
            tableContent += '<tr>';
            tableContent += '<td>' + this.name + '</td>';
            tableContent += '<td>' + this.andrewId + '</td>';
            tableContent += '<td>' + this.problem + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" time='+ this.timestamp + ' rel="' + this._id + '">Done</a></td>';
            tableContent += '</tr>';
        });
        //every time we repopulate the table, we recalculate average help time
        setAverageHelpTime()
        $('#userList table tbody').html(tableContent);
    });
}
