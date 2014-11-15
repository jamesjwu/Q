// TODO: Global vairable is bad
var loggedIn = false
var userListData = []; 

$(document).ready(function() {
    populateTable();
    $('#btnAddUser').on('click', addUser);
    $('#addUser input').on('change', resetInput);
    $('#userList').on('click', 'a.linkdeleteuser', deleteUser);  

});

var timeout = setInterval(populateTable, 10000)


function close_modal(modal_id){
    $("#lean_overlay").fadeOut(200);
    $(modal_id).fadeOut(200, function() {
        $(this).css('top', 0);
    });
    
    // $(modal_id).css({ 'display' : 'none' });

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
function setAverageHelpTime() {
    // get all the help times by JSON
    return $.getJSON('/users/gettimes', function(data) {
        var sum = 0.0
        for(var i = 0; i < data.length; i++) {
            sum += parseFloat(data[i].time)
        }
        // average help time = average time per entry * (number of entries + 1)
        var time = (sum/data.length)*(userListData.length+1)
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

    //take the average help time length, and multiply by how many people are in the queue
    

}

//on the event of a delete, we calculate how long it took the person to get helped
function deleteUser(event) {
    event.preventDefault();
    var time = $(this).attr('time')
    trackTime({time: getTimeHelped(time)})
    // only consider cases when time took more than one minute 
    $.ajax({
        type: "DELETE",
        url: "/users/deleteuser/"+$(this).attr('rel')
    }).done(function(response) {
        if (response.msg === '') {
            //update table
            populateTable();
        } else {
            toast(response.msg, 1000);
        }
    });

}
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
        for (var i = 0; i < userListData.length; i++) {
            if(localStorage.lastAdd) {
                    if(new Date().getTime() - localStorage.lastAdd < 10000) {
                        toast("You can't add yourself so quickly since your last add", 750);
                        return;
                    }
            }
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
                toast("Entered the queue!", 750)
                if (localStorage.getItem(newUser.andrewId) == null) {
                    localStorage.setItem(newUser.andrewId, newUser.andrewId);
                }
            } else {
                toast(response.msg, 750);
            }
            localStorage.lastAdd = new Date().getTime()
        });
    } else {
        return false;
    }
}

function isLoggedIn() {
    return $.ajax( {
        type: "GET",
        url: "/check",
        dataType: 'JSON',
        async: false,
    }).responseJSON.msg;
}

function populateTable() {
    var tableContent = '';
    // jQuery AJAX call for JSON
    $.getJSON('/users/userlist', function(data) {
        oldlength = userListData.length
        userListData = data;

        $.each(data, function() {
            tableContent += '<div class="row">';
            tableContent += '<div class = "col s3">' + this.name + '</div>';
            tableContent += '<div class = "col s3">' + this.andrewId + '</div>';
            tableContent += '<div class = "col s3">' + this.problem + '</div>';
            if(isLoggedIn()) {
                tableContent += '<div class = "col s3"> <a href="#" class="linkdeleteuser" time='+ this.timestamp + ' rel="' + this._id + '">Done </a></div>';
            }
            else {
                var andrewId = this.andrewId;
                if (localStorage.getItem(this.andrewId) != null) {
                    tableContent += '<div class = "col s3"> <a href="#" class="linkdeleteuser" time='+ this.timestamp + ' rel="' + this._id + '">Done </a></div>';
                } else {
                    tableContent += '<div class = "col s3"> </div>'
                }
            }
            tableContent += '</div><br>';
        });
   
        setAverageHelpTime()   

        $('#userList').html(tableContent);
    });
}
