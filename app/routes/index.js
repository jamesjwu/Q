var express = require('express');
var router = express.Router();
var hash = require('object-hash');
var fs = require('fs');


var coursePass = fs.readFileSync('coursePass.txt').toString();
var TAs = fs.readFileSync('TAAndrewIDs.txt').toString().split('\n');
var students = fs.readFileSync('studentIDs.txt').toString().split('\n');
var tokens = fs.readFileSync('slack.txt').toString().trim().split('\n');

var courseTitle = "CMUQ";
var courseBulletin = "";
var latestMetrics = [];
var latestDay = null;

var labCodes = {};

/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'CmuQ'
    });
});

router.post('/sps', function(req, res) {
    if(req.body.token == tokens[0]) {
        labCodes[req.body.text.toLowerCase().charAt(0)] = req.body.text;
        res.send("Lab code registered for section " + req.body.text.charAt(0));
    }
    else {
        res.send({error:"No"});
    }
});


router.post('/ps', function(req, res) {
    if(req.body.token == tokens[1]) {
        res.send("Code for lab " + req.body.text.toUpperCase().charAt(0)
            + ": " + labCodes[req.body.text.toLowerCase().charAt(0)]);
    }
    else {
        res.send({error:"No"});
    }
});

router.post('/qtimes', function(req, res) {
    if(req.body.token == tokens[1]) {

        res.send({});
    }
    else {
        res.send({error:"No"});
    }
});


router.get('/metrics', function(req, res) {
    if (req.session.loggedIn) {
        res.render('metrics', {
            title: 'CmuQ'
        });
    } else {
        res.render('index', {
            title: 'CmuQ'
        });
    }
});

router.post('/getmetrics', function(req, res) {
    if (!req.session.loggedIn) {
        res.send({
            msg: "Nice try."
        });
        return;
    }
    /* Cache the result per day so that we don't keep pinging the server */
    date = new Date(req.body.endTime);
    if (date.getDate() == latestDay) {
        res.json(latestMetrics);
        return;
    }
    var db = req.db;
    db.collection('metrics').find({
        timestamp: {
            $gt: parseInt(req.body.startTime),
            $lt: parseInt(req.body.endTime)
        }
    }).toArray(function(err, items) {
        latestMetrics = items;
        latestDay = date.getDate();
        res.json(latestMetrics);
    });

});

function sanitizeString(str) {
    return str.replace(/</gim, "&lt;").replace(/>/gim, "&gt;").trim();
}

router.get('/getname', function(req, res) {

    res.send({
        msg: courseTitle
    });

});


router.get('/getbulletin', function(req, res) {
    res.send({
        msg: courseBulletin
    });
});



router.post('/setbulletin', function(req, res) {
    if (req.session.loggedIn) {
        courseBulletin = sanitizeString(req.body.bulletin);
        res.send({
            msg: 'Announcement changed'
        });
    } else {
        res.send({
            msg: 'Nice try'
        });
    }

});

router.post('/setname', function(req, res) {
    if (req.session.loggedIn) {
        courseTitle = sanitizeString(req.body.name);
        res.send({
            msg: 'Name changed!'
        });
    } else {
        res.send({
            msg: 'Nice try'
        });
    }
});



router.post('/authenticate', function(req, res) {
    if ((TAs.indexOf(req.body.andrewId) >= 0)) {
        if (hash.MD5(req.body.pass) == coursePass) {
            var currDate = new Date().getTime();
            var secretHash = hash.MD5(currDate);
            res.send({
                msg: 'Welcome',
                sessionKey: secretHash
            });
            req.session.loggedIn = true;
        } else {
            res.send({
                msg: "Wrong password"
            });
        }
    } else {
        res.send({
            msg: "Wrong andrewID"
        });
    }
});


router.post('/logout', function(req, res) {
    req.session.loggedIn = false;
    res.send({
        msg: req.session.loggedIn
    });
});


router.get('/check', function(req, res) {
    res.send({
        msg: req.session.loggedIn
    });
});

/* Route to /admin for the dashboard */
router.get('/admin', function(req, res) {
    if (req.session.loggedIn) {
        res.render('admin', {
            title: 'CmuQ'
        });
    } else {
        res.render('index', {
            title: 'CmuQ'
        });
    }
});

router.get('/mobile', function(req, res) {
    if (req.session.loggedIn) {
        res.render('mobile', {
            title: 'CmuQ'
        });
    } else {
        res.render('index', {
            title: 'CmuQ'
        });
    }
});

module.exports = router;