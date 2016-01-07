
/* Initialize and bind targets to buttons */
$(document).ready(function() {
    populateTable();
    $('#btnAddUser').on('click', addUser);
    refreshAnnouncements();
    // Typing return can add someone to the queue
    $('#inputUserName').bind('keypress', handleKeyPressInAdd);
    $('#inputUserAndrewId').bind('keypress', handleKeyPressInAdd);
    $('#inputUserProblem').bind('keypress', handleKeyPressInAdd);

    $('#addUser input').on('click', resetInput);
    refreshHelpStudent();
    $('#userList').on('click', 'a.linkdeleteuser', deleteUser);
    setAverageHelpTime();
    socket.on('add', function(data) {
        updateAdd(data);
        setAverageHelpTime();
    });
    socket.on('delete', function(data) {
        updateDelete(data);
        setAverageHelpTime();
    });
    socket.on('refresh', function(data) {
        refreshTitle();
        refreshAnnouncements();
        setAverageHelpTime();
    });
    setAverageHelpTime();

});

/* This enables enter key pressing */
function handleKeyPressInAdd(e) {
    if (e.keyCode === 13) {
        addUser(e);
    }
}

/*  */
function refreshHelpStudent() {
    if (isLoggedIn()) {
        $('div#helpStudents').html("<center> <a class='waves-effect waves-light btn' id='btnHelpStudent'> Help next student </a> </center>");
    }
    else {
        $('div#helpStudents').html('');
    }
}






/* resetInput - Makes input box color change back to neutral */
function resetInput(event) {
    event.preventDefault();
    $(this).css('border-color', 'initial');
}







/* addUser - Add a user to the queue, with spam check */
function addUser(event) {
    $(this).css('outline', 'none');
    event.preventDefault();

    var errorCount = 0;
    $('#addUser input').each(function(index, val) {
        if ($(this).val().trim() === '') {
            $(this).css('border-color', '#ff5722');
            errorCount++;
        }
    });

    if (errorCount === 0) {
        var newUser = {
            'name': $('input#inputUserName').val(),
            'andrewId': $('input#inputUserAndrewId').val(),
            'problem': $('input#inputUserProblem').val(),
        };

        /* Check the user hasn't added in the last 10 seconds since last call */
        for (var i = 0; i < userListData.length; i++) {
            if (localStorage.lastAdd) {
                    if (new Date().getTime() - localStorage.lastAdd < 10000) {
                        toast("You can't add yourself so quickly since your last add", 750);
                        return;
                    }
            }
        }
        /* Send to server */
        $.ajax({
            type: 'POST',
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function(response) {
            if (response.success) {
                $('input#inputUserProblem').val('');
                //socket.emit('update', {command:'add', user: newUser});
                //newUser
                // response the newUser plus the field id which is generated
                // by mongoDB
                socket.emit('add', {user: response.user[0]});
                //populateTable();
                toast('Entered the queue!', 750);
            } else {
                toast(response.msg, 750);
            }
            localStorage.lastAdd = new Date().getTime();
        });
    } else {
        return false;
    }
}

