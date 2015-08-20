/* Common functions for all frontend stuff */
$(document).ready(function() {
	refreshTitle();
    $('#');
});

function refreshTitle() {
    $('#name').html(" <a href='/' class='brand-logo'>" + get_name() + '</a>');
}


/* populateTable - similar to updating table view */
function populateTable() {
    var tableContent = '';
    // jQuery AJAX call for JSON
    $.getJSON('/users/userlist', function(data) {
        oldlength = userListData.length;
        userListData = data;
        var loggedin = isLoggedIn();

        $.each(data, function() { /* For each user in the list of users add rows to the table */

            tableContent += '<div class="row">';
            tableContent += '<div class = "col s2">' + this.name + '</div>';
            tableContent += '<div class = "col s2">' + this.andrewId + '</div>';
            if (loggedin) {
                tableContent += '<div class = "col s6">' + this.problem + '</div>';

                tableContent += '<div class = "col s2"> <a href="#" class="waves-effect waves-light btn cyan linkdeleteuser" time=' + this.timestamp + ' id="' + this._id + '">Help </a></div>';
            }
            else {
                 tableContent += '<div class = "col s6">' + this.problem + '</div>';
            }

            tableContent += '</div>';
        });

        

        $('#userList').html(tableContent);
    });
}
/* setAverageHelpTime - calculates average help time for next person
    to enter the queue */
function setAverageHelpTime() {
    // Get all the help times by JSON call
    return $.getJSON('/users/gettimes', function(data) {
        var time = data.time;
    
        $('#averageHelpTime').html("<font color='gray'> Average Help Time: </font>" + Math.round(time) + ' minute(s)');

        if (time > 30) {
            $('#averageHelpTime').css('color', 'red');
        }
        else if (time > 15) {
            $('#averageHelpTime').css('color', 'orange');
        }
        else {
            $('#averageHelpTime').css('color', 'green');
        }
    });

    /* TO DO */
    //Take the average help time length, and multiply by how many people are in the queue


}

/* getTimeHelped - Takes time boject, calculates the amount of time
                    in minutes it took the person to get helped
*/
function getTimeHelped(time) {
    return (new Date().getTime() - time) / 1000 / 60;
}

/* trackTime- Tell the server the new time */
function trackTime(newTime) {
    $.ajax({
            type: 'POST',
            data: newTime,
            url: '/users/tracktime',
            dataType: 'JSON'
        }).done(function(response) {
        });
}

/* deleteUser - Delete user, keep track of new average time */
function deleteUser(event) {
    if (!localStorage.sessionKey) {
        toast('Nice try');
    }
    else {
        event.preventDefault();
        var time = $(this).attr('time');
        var userId = $(this).attr('id');
        trackTime({time: getTimeHelped(time)});
        // Only consider cases when time took more than one minute
        $.ajax({
            type: 'DELETE',
            url: '/users/deleteuser/'+ userId
        }).done(function(response) {
            if (response.msg === '') {
                //Update table
                socket.emit('delete', {key: localStorage.sessionKey, user: userId});
            } else {
                toast(response.msg, 1000);
            }
        });
    }

}



/* what do you think this does */
function isLoggedIn() {
    return $.ajax({
        type: 'GET',
        url: '/check',
        dataType: 'JSON',
        async: false,
    }).responseJSON.msg;
}


function get_bulletin() {
    return $.ajax({
        type: 'GET',
        url: '/getbulletin',
        dataType: 'JSON',
        async: false,
    }).responseJSON.msg;
}

function get_name() {
    return "<a href='#' class= 'brand-logo'>" + $.ajax({
        type: 'GET',
        url: '/getname',
        dataType: 'JSON',
        async: false,
    }).responseJSON.msg + '</a>';
}


function updateDelete(update) {
    $('#'+ update.user).parent().parent().next('br').remove();
    $('#'+ update.user).parent().parent().remove();
}

function updateAdd(update) {
    var loggedin = isLoggedIn();
    var content = '';
    content += '<div class="row">';
    content += '<div class = "col s2">' + update.user.name + '</div>';
    content += '<div class = "col s2">' + update.user.andrewId + '</div>';
    if (loggedin) {
        content += '<div class = "col s6">' + update.user.problem + '</div>';
        content += '<div class = "col s2"> <a href="#" class="waves-effect waves-light btn linkdeleteuser" time=' + update.user.timestamp + ' id="' + update.user._id + '">Help </a></div>';

    } else {
        content += '<div class = "col s6">' + update.user.problem + '</div>';
    }
    content += '</div>';

    $('#userList').append(content);
}

function refreshAnnouncements() {
    if (get_bulletin() != '') {
        $('#courseBulletin').html('<div class = "row"> <center> <h4>' + get_bulletin() + ' </h4> </center> </div>');
    }
    else {
        $('#courseBulletin').html('');
    }
}