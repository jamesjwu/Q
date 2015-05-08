var on = false;
$(document).ready(function() {
    getEmailAlertSetting();
    $('#btnFreezeQueue').on('click', freeze_queue);
    $('#btnResetQueue').on('click', cleartimes);
    $('#btnChangeName').on('click', btnSetName);
    $('#emailAlertSwitch').on('change', toggleEmails);
    $('#btnInputBulletin').on('click', btnSetBulletin);
    $('#emailAlertSwitchLabel').html(on ? "On" : "Off");
    

    $('#inputQueueName').attr('placeholder', get_name());
    $('#inputBulletin').attr('placeholder', "New Bulletin");

});
var socket = io();

function cleartimes() {
    if (confirm("Really clear all average queue times?")) {
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
        data: {
            'bulletin': bulletin
        },
        dataType: 'JSON',
    }).done(function(response) {
        toast(response.msg, 1000);
        socket.emit("refresh", {});
    });
}

function btnSetBulletin(event) {
    console.log("Set bulletin");
    set_bulletin(
        $('input#inputBulletin').val()
    );
}

function getEmailAlertSetting() {
    $.ajax({
        type: "GET",
        url: "/users/getEmailAlerts",
        
        dataType: 'JSON',
    }).done(function(response) {
        on = response.msg;
        $('#emailAlertSwitchLabel').html(on ? "On" : "Off");
        if(on) {
        $('#emailAlertCheck').attr('checked', "true");
    }
    });
}

function toggleEmails() {
    on = !on;
    $('#emailAlertSwitchLabel').html(on ? "On" : "Off");

    $.ajax({
        type: "POST",
        url: "/users/toggleEmailAlerts",
        data: {
            'name': name
        },
        dataType: 'JSON',
    }).done(function(response) {
        toast(response.msg, 1000);
    });

}

function btnSetName(event) {
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
        toast(response.msg, 1000);

    });
}


function set_name(name) {
    $.ajax({
        type: "POST",
        url: "/setname",
        data: {
            'name': name
        },
        dataType: 'JSON',
    }).done(function(response) {
        toast(response.msg, 1000);
        $('#name').html("<a href = '/' class='brand-logo'>" + get_name() + "</a>");
        socket.emit("refresh", {});
    });
}