$(document).ready(function() {
    populateMobile();
    refreshAnnouncements();
    setAverageHelpTime();
    refreshMobileTitle();

    $('#userList').on('click', 'a.linkdeleteuser', deleteUser);
    socket.on('add', function(data) {
        updateAdd(data);
    });
    socket.on('delete', function(data) {
        updateDelete(data);
    });
    socket.on('refresh', function(data) {
        refreshMobileTitle();
        refreshAnnouncements();
    });
});

function get_mobile_name() {
    return "<a href='#' class= 'brand-logo' id='mobile'>" + $.ajax({
        type: 'GET',
        url: '/getname',
        dataType: 'JSON',
        async: false,
    }).responseJSON.msg + '</a>';
}

function refreshMobileTitle() {
    $('#name').html(get_mobile_name());
}

function populateMobile() {
    var tableContent = '';
    // jQuery AJAX call for JSON
    $.getJSON('/users/userlist', function(data) {
        oldlength = userListData.length;
        userListData = data;
        var loggedin = isLoggedIn();

        $.each(data, function() { /* For each user in the list of users add rows to the table */
            tableContent += '<tr>';
            tableContent += '<td>' + this.name + '</td>';
            if (loggedin) {
                tableContent += '<td>' + this.problem + '</td>';

                tableContent += '<td> <a href="#" class="waves-effect waves-light btn-large linkdeleteuser" time=' + this.timestamp + ' id="' + this._id + '"> Help </a></td>';
            }
            tableContent += '</div>';
        });

        

        $('tbody#userList').html(tableContent);
    });
}