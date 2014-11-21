// TODO: Fix global variables later if possible
var userListData = []; 
var socket = io();

/* Initialize and bind targets to buttons */
$(document).ready(function() {
    populateTable();
    $('#btnAddUser').on('click', addUser);
    $('#addUser input').on('change', resetInput);
    $('#userList').on('click', 'a.linkdeleteuser', deleteUser);  
    socket.on('update', function(data) {
        populateTable();
    });
});


/* close_modal - Modal closer */
function close_modal(modal_id){
    $("#lean_overlay").fadeOut(200);
    $(modal_id).fadeOut(200, function() {
        $(this).css('top', 0);
    });
}

/* resetInput - Makes input box color change back to neutral */
function resetInput(event) {
    event.preventDefault();
    $(this).css("border-color", "initial")
}

/* getTimeHelped - Takes time boject, calculates the amount of time 
                    in minutes it took the person to get helped
*/
function getTimeHelped(time) {
    return (new Date().getTime() - time) / 1000 / 60;
}


/* setAverageHelpTime - calculates average help time for next person
    to enter the queue */
function setAverageHelpTime() {
    // Get all the help times by JSON call
    return $.getJSON('/users/gettimes', function(data) {
        var sum = 0.0
        for(var i = 0; i < data.length; i++) {
            sum += parseFloat(data[i].time)
        }
        // Average help time = average time per entry * (number of entries + 1)
        var time = (sum/data.length)
        if(data.length == 0)
            time = 0
        
        $('#averageHelpTime').html("<font color='black'> Average Help Time: </font>" + Math.round(time) + " minute(s)")

        if(time > 30) {
            $('#averageHelpTime').css("color", "red")
        }  
        else if(time > 15) {
            $('#averageHelpTime').css("color", "orange")
        }
        else {
            $('#averageHelpTime').css("color", "green")   
        }
    })

    /* TO DO */
    //Take the average help time length, and multiply by how many people are in the queue
    

}

/* deleteUser - Delete user, keep track of new average time */
function deleteUser(event) {
    event.preventDefault();
    var time = $(this).attr('time')
    trackTime({time: getTimeHelped(time)})
    // Only consider cases when time took more than one minute 
    $.ajax({
        type: "DELETE",
        url: "/users/deleteuser/"+$(this).attr('rel')
    }).done(function(response) {
        if (response.msg === '') {
            //Update table
            socket.emit('update', {command:'delete', user:$(this).attr('rel')});
            updateTable({command:'delete', user:$(this).attr('rel')});
        } else {
            toast(response.msg, 1000);
        }
    });

}

/* trackTime- Tell the server the new time */
function trackTime(newTime) {
    $.ajax({
            type: "POST",
            data: newTime,
            url: '/users/tracktime',
            dataType: 'JSON'
        }).done(function(response) {
            console.log(response.msg)
        });
}

/* addUser - Add a user to the queue, with spam check */
function addUser(event) {
    $(this).css('outline', 'none')
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
        /* Check the user hasn't added in the last 10 seconds since last call */ 
        for (var i = 0; i < userListData.length; i++) {
            if(localStorage.lastAdd) {
                    if(new Date().getTime() - localStorage.lastAdd < 10000) {
                        console.log("enter");
                        toast("You can't add yourself so quickly since your last add", 750);
                        return;
                    }
            }
        }
        /* Send to server */
        $.ajax({
            type: "POST",
            data: newUser,
            url: '/users/adduser',
            dataType: 'JSON'
        }).done(function(response) {
            if (response.msg === '') {
                $('#addUser fieldset input#inputUserProblem').val('');
                socket.emit('update', {command:'add', user: newUser});
                populateTable();
                toast("Entered the queue!", 750);
            } else {
                /* Tell user they have been added */
                toast(response.msg, 750);
            }
            localStorage.lastAdd = new Date().getTime()
        });
    } else {
        return false;
    }
}




function updateTable(update) {
    if(update.command == 'delete') {
        var tableContent = $('#userList').children()


    }
    else {
        populateTable()
    }
}