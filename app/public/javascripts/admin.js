/* Admin.js: Controls the admin panel */

var emailAlerts = false;

$(document).ready(function() {
    getEmailAlertSetting();
    // turn on all button settings
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


/* Deletes all average queue information */
function cleartimes() {
    if (confirm("Really clear all average queue times?")) {
        $.ajax({
            type: 'GET',
            url: '/users/cleartimes',
            dataType: 'JSON'
        });

        toast('Cleared Times', 750);
    }
}

/* Make the bulletin */
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

/* The button that sets the bulletin */
function btnSetBulletin(event) {
    set_bulletin(
        $('input#inputBulletin').val()
    );
}

/* obtain email alert settings */
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

/* switch email alerts on/off */
function toggleEmails() {
    emailAlerts = !emailAlerts;
    $('#emailAlertSwitchLabel').html(emailAlerts ? "On" : "Off");

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

/* set the name */
function btnSetName(event) {
    console.log("Set name");
    set_name(
        $('input#inputQueueName').val()
    );
}

/* stop people from signing up on the queue */
function freeze_queue() {
    $.ajax({
        type: "POST",
        url: "/users/freezequeue",
        dataType: 'JSON',
    }).done(function(response) {
        toast(response.msg, 1000);

    });
}

/* set the name of the queue */
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
