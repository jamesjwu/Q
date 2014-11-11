
$(document).ready(function() {
    $('#btnLogin').on('click', login);
    $('input').on('change', resetInput);
    loginReady()

});
function loginReady() {

    if(isLoggedIn()) {
        $('#LoginLogout').html("<a href='#'> Logout </a>");
        $('#LoginLogout').on('click', logout)
        $('#averageHelpButton').html("<a href='#'>Reset times</a>")
        $('#averageHelpButton').on('click', cleartimes)
        $('#metrics').html("<a href = '#'> Metrics </a>")
    }
    else {
        $('#LoginLogout').html("<a href='#login' class='modal-trigger'> TA Login </a>")
        $('.modal-trigger').leanModal();
        $('#LoginLogout').off('click')
        $('#averageHelpButton').html("")
        $('#metrics').html("")

    }
}

function cleartimes() {
    var yes = confirm("Really clear all average queue times?")
    if(yes){
        $.ajax({
            type: "GET",
            url: '/users/cleartimes',
            dataType: 'JSON'
        });
        populateTable()
        loginReady()
        toast("Cleared Times", 750)


    }
}

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


function logout(event) {   
    event.preventDefault();
    $.ajax({
        type: "POST",
        url: '/logout',
        dataType: 'JSON'
    }).done(function(response) {
        toast("Logged out", 750)
        loginReady()
        populateTable()
    });
}

function login(event) {
    event.preventDefault();
    var loginInfo = {'andrewId': $('input#inputTAAndrewId').val(),
                     'pass': $('input#inputCoursePassword').val()};
    // send request to the server
    $.ajax({
        type: "POST",
        data: loginInfo,
        url: '/authenticate',
        dataType: 'JSON'
    }).done(function(response) {
        console.log(response.msg)
        if(response.msg !="Welcome") {
            toast("Incorrect andrewID or password!", 750);
            $('input#inputTAAndrewId').css("border-color", "red");
            $('input#inputCoursePassword').css("border-color", "red");
        }
        else {
            $('input#inputTAAndrewId').val('');
            $('input#inputCoursePassword').val('');
            close_modal('#login')
            toast("Logged in!", 750);
            populateTable()
            loginReady()
            

        }
    }); 
}
