$(document).ready(function() {
    
	$('#btnFreezeQueue').on('click', freeze_queue)
	$('#btnResetQueue').on('click', cleartimes);
    $('#btnChangeName').on('click', btnSetName);
    $('#inputQueueName').attr('placeholder', get_name())
})

function cleartimes() {
    if(confirm("Really clear all average queue times?")){
        $.ajax({
            type: "GET",
            url: '/users/cleartimes',
            dataType: 'JSON'
        });
        toast("Cleared Times", 750);
    }
}


function set_bulletin(bulletin) {
    $.ajax({
        type: "POST",
        url: "/setbulletin",
        data: {'bulletin': bulletin},
        dataType: 'JSON',
    }).done(function(response) {
        toast(response.msg, 1000)
    });
}

function btnSetName(event)
{
    console.log("Set name");
    set_name(
        $('input#inputQueueName').val()
    );
}


function freeze_queue() {
	$.ajax({
		type: "POST",
		url: "/users/freezequeue",
		dataType: 'JSON',
	}).done(function(response) {
		toast(response.msg, 1000)
	})
}


function set_name(name) {
    $.ajax({
        type: "POST",
        url: "/setname",
        data: {'name': name},
        dataType: 'JSON',
    }).done(function(response) {
        toast(response.msg, 1000)
        $('#name').html("<a href = '/' class='brand-logo'>" + get_name() + "</a>")
    });
}