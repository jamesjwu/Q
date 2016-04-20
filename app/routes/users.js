var express = require('express');
var router = express.Router();
var fs = require('fs');

var students = fs.readFileSync('studentIDs.txt').toString().split('\n');
try {
    var webhookUri = fs.readFileSync('webhookURI.txt').toString();
}
catch(err) {
    console.log("No slack file detected. Skipping");
    var webhookUri = null;
}
var queueFrozen = false;
var entryCount = 0;
var lastEmail = -1;
var emailAlerts = true;
var currTime = 0;

var nodemailer = require('nodemailer');

try {
    var emailPass = fs.readFileSync('emailPass.txt').toString();
}
catch(err) {
    console.log("No email file detected. Skipping");
    var emailPass = null;
}

var Slack = require('slack-node');

// email transporter
var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: '15122queue@gmail.com',
        pass: emailPass
    }
});
var mailOptions = {
    from: '15122 Queue ✔ <15122queue@gmail.com>', // sender address
    to: 'james.jz.wu@gmail.com', // list of receivers
    subject: 'The queue is getting awfully long... ', // Subject line
    text: 'The office hour queue has detected a 40 minute or longer wait time. If you have time, please come to help! ✔', // plaintext body
    html: 'The office hour queue has detected a 40 minute or longer wait time. If you have time, please come to help!' // html body
};



slack = new Slack();
slack.setWebhook(webhookUri);


/* GET users listing. */
router.get('/', function(req, res) {
    res.send('respond with a resource');
});

router.post('/qtimes', function(req, res) {
    res.send("Average queue time: " + Math.round(currTime) + " minutes");
});

function sanitizeString(str) {
    return str.replace(/</gim, "&lt;").replace(/>/gim, "&gt;").trim();
}


router.get('/userlist', function(req, res) {
    var db = req.db;
    db.collection('userlist').find().toArray(function(err, items) {
        items.sort(function(a, b) {
            return a.timestamp - b.timestamp;
        });
        res.json(items);
    });
});


router.post('/freezequeue', function(req, res) {
    if (req.session.loggedIn) {
        queueFrozen = !queueFrozen;
        if (queueFrozen) {
            res.send({
                msg: 'Queue frozen'
            });
        } else {

            res.send({
                msg: 'Queue unfrozen'
            });
        }
    } else {
        res.send({
            msg: 'Nice try'
        });
    }
});



router.post('/adduser', function(req, res) {
    if (queueFrozen) {
        res.send({
            msg: 'Sorry, the TAs have frozen the queue!'
        });
        return;
    };
    var db = req.db;
    var andrewId = req.body.andrewId;

    if (students.indexOf(andrewId.toLowerCase()) < 0) {
        res.send({
            msg: "Your andrewID isn't associated with 15122!"
        });
        return;
    }

    var cursor = db.collection('userlist').find({
        "andrewId": andrewId.toLowerCase()
    }).toArray(function(err, items) {
        if (items.length > 0) {
            res.send({
                msg: "You can't add yourself twice in a row to the queue!"
            });
            return;
        } else {

            var user = req.body;
            user.timestamp = new Date().getTime();
            user.name = sanitizeString(req.body.name).toLowerCase();
            user.andrewId = sanitizeString(req.body.andrewId);
            user.problem = sanitizeString(req.body.problem);


            // insert the data into our metrics database
            db.collection('metrics').insert(user, function(err, result) {});
            db.collection('userlist').insert(user, function(err, result) {
                if (err) {
                    res.send({
                        msg: err,
                        success: false
                    });
                } else {
                    // if input had to be sanitized
                    res.send({
                        msg: 'Entered the queue!',
                        success: true,
                        user: result
                    });
                }
            });
        }
    });


});


router.get('/cleartimes', function(req, res) {

    if (req.session.loggedIn) {
        var db = req.db;
        db.collection('times').drop();
        db.collection('userlist').drop();

        res.send({
            msg: "Done"
        });
    } else {
        res.send({
            msg: "Nice Try"
        });
    }

});

router.post('/toggleEmailAlerts', function(req, res) {
    if (req.session.loggedIn) {
        emailAlerts = !emailAlerts;
        res.send({
            msg: "Email Alerts turned " + (emailAlerts ? "on" : "off")
        });
    } else {
        res.send({
            msg: "Nice Try"
        });
    }
});
router.get('/getEmailAlerts', function(req, res) {
    if (req.session.loggedIn) {
        res.send({
            msg: emailAlerts
        });
    } else {
        res.send({
            msg: "Nice Try"
        });
    }
});

router.get('/gettimes', function(req, res) {
    var db = req.db;
    var sum = 0.0
    db.collection('times').find().toArray(function(err, data) {
        for (var i = 0; i < data.length; i++) {
            console.log(data[i]);
            sum += parseFloat(data[i].time);
        }
        // Average help time = average time per entry * (number of entries + 1)
        var time = (sum / data.length);

        if (data.length == 0) {
            time = 0;
        }
        currTime = time;

        if(emailAlerts) {
            threshold = 40;
            // if it's longer than 100
            // it's clearly not an actual help time, but perhaps something leftover.
            if (time > threshold && time < 100 && !queueFrozen) {
                // only send one email per day
                if (new Date().getDay() != lastEmail) {
                    console.log("Sending email");
                    if(webhookUri !== null) {
                        slack.webhook({
                          channel: "#office-hours",
                          username: "15-122 Queue",
                          text: "The queue is getting awfully long.. average wait time is at " + time + " minutes.\n" +
                                "Please come help if you can!!"
                        }, function(err, response) {
                          console.log(response);
                        });
                    }
                    if(emailPass !== null) {
                        lastEmail = new Date().getDay();
                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, function(error, info) {
                            if (error) {
                                console.log(error);
                            } else {
                                console.log('Message sent: ' + info.response);
                            }
                        });
                    }
                }
            }
        }


        res.json({time:time});
    });
});


router.post('/tracktime', function(req, res) {
    var db = req.db;
    db.collection('archive').insert(req.body, function(err, result) {});

    db.collection('times').insert(req.body, function(err, result) {
        res.send(
            (err === null) ? {
                msg: "req.body is " + req.body
            } : {
                msg: err
            }
        );
    });

});

router.delete('/deleteuser/:id', function(req, res) {
    // Check log in
    if (req.session.loggedIn) {
        var db = req.db;
        var userToDelete = req.params.id;
        db.collection('userlist').removeById(userToDelete, function(err, result) {
            res.send((result === 1) ? {
                msg: ''
            } : {
                msg: 'error: ' + err
            });
        });
    } else {
        res.send({
            msg: 'Nice try.'
        });
    }
});

module.exports = router;
