// TODO: Global vairable is bad
var userListData = []; 

$(document).ready(function() {
    $('#btnAddUser').on('click', addUser);
    $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
    populateTable();
});

function deleteUser(event) {
    event.preventDefault();

    var confirmation = confirm('Are you sure you want to delete?');
    
    if (confirmation === true) {
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
    } else {
        // If they said no to the confirm, do nothing
        return false;
    }
}

function addUser(event) {
    event.preventDefault();

    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if ($(this).val() === '') {errorCount++};
    });

    if (errorCount === 0) {
        var newUser = {
            'name': $('#addUser fieldset input#inputUserName').val(),
            'andrewId': $('#addUser fieldset input#inputUserAndrewId').val()
        }
        $.ajax({
            type: "POST",
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function(response) {
            if (response.msg === '') {
                $('#addUser fieldset input').val('');

                populateTable();
            } else {
                alert('Error: ' + response.msg);
            }
        });
    } else {
        alert("Please fill in all fields.");
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
            tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '" title="Show Details">' + this.name + '</a></td>';
            tableContent += '<td>' + this.andrewId + '</td>';
            tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
            tableContent += '</tr>';
        });

        $('#userList table tbody').html(tableContent);
    });
}
