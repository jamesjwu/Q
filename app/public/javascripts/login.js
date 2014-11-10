// TODO: Global vairable is bad

$(document).ready(function() {
    $('#btnLogin').on('click', login);
    $('input').on('change', resetInput);
    $('.modal-trigger').leanModal();

});

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
        data: loginInfo,
        url: '/logout',
        dataType: 'JSON'
    }).done(function(response) {
        toast("Logged out")
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
            toast("Incorrect andrewID or password!", 2000);
            $('input#inputTAAndrewId').css("border-color", "red");
            $('input#inputCoursePassword').css("border-color", "red");
        }
        else {
            $('input#inputTAAndrewId').val('');
            $('input#inputCoursePassword').val('');
            close_modal('#login')
            toast("Logged in!", 2000);
            

        }
    }); 
}
