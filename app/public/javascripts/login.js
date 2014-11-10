// TODO: Global vairable is bad

$(document).ready(function() {
    $('#btnLogin').on('click', login);
});

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
        console.log(response.msg);
        //$('login-container').append("<div class='.row'>"+response.msg+"<div>");
        $('input#inputTAAndrewId').val('');
        $('input#inputCoursePassword').val('');
    });
}
