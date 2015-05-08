var express = require('express');
var router = express.Router();
var hash = require('object-hash');
var fs = require('fs');


var coursePass = fs.readFileSync('coursePass.txt').toString();
var TAs = fs.readFileSync('TAAndrewIDs.txt').toString().split('\n');
var students = fs.readFileSync('studentIDs.txt').toString().split('\n');

var courseTitle = "CMUQ";
var courseBulletin = "";
var latestMetrics = [];
var latestDay = null;



/* GET home page. */
router.get('/', function(req, res) {
    res.render('index', {
        title: 'CmuQ'
    });
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
    console.log("Getting metrics");
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
        courseBulletin = req.body.bulletin;
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
        courseTitle = req.body.name;
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

module.exports = router;