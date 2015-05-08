$(document).ready(function() {
	refreshTitle();
    $('#');
})

function refreshTitle() {
    $('#name').html(" <a href='/' class='brand-logo'>" + get_name() + "</a>")
}


/* populateTable - similar to updating table view */
function populateTable() {
    var tableContent = '';
    // jQuery AJAX call for JSON
    $.getJSON('/users/userlist', function(data) {
        oldlength = userListData.length
        userListData = data;
        var loggedin = isLoggedIn();

        $.each(data, function() { /* For each user in the list of users add rows to the table */

            tableContent += '<div class="row">';
            tableContent += '<div class = "col s2">' + this.name + '</div>';
            tableContent += '<div class = "col s2">' + this.andrewId + '</div>';
            if(loggedin) {
                tableContent += '<div class = "col s6">' + this.problem + '</div>';

                tableContent += '<div class = "col s2"> <a href="#" class="waves-effect waves-light btn linkdeleteuser" time='+ this.timestamp + ' id="' + this._id + '">Help </a></div>';
            }
            else {
                 tableContent += '<div class = "col s6">' + this.problem + '</div>';
            }
            
            tableContent += '</div>';
        });
   
        setAverageHelpTime()   

        $('#userList').html(tableContent);
    });
}

function get_name() {
    return $.ajax( {
        type: "GET",
        url: "/getname",
        dataType: 'JSON',
        async: false,
    }).responseJSON.msg 
}


/* isLoggedIn */
function isLoggedIn() {
    return $.ajax( {
        type: "GET",
        url: "/check",
        dataType: 'JSON',
        async: false,
    }).responseJSON.msg;
}
