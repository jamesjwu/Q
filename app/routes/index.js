var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'CmuQ' });
});


router.post('/authenticate', function(req, res) {
    // TODO: remove the hard coded list from code later, put them in a
    // seperate file
    var TAs = ['kmao', 'jingzew', 'lchoung', 'yuanj'];
    var coursePass = 'hey122';
    if ((TAs.indexOf(req.body.andrewId) >= 0)) {
        if(req.body.pass === coursePass) {
            res.send({msg: 'Welcome'});
            req.session.loggedIn = true;
        } 
        else {
            res.send({msg:'incorrect password'})
        }
    }   
    else {
        res.send({msg: 'Incorrect andrewId'});
    }
    console.log(req.session.loggedIn);
});


router.post('/logout', function(req, res) {
    req.session.loggedIn = false;
    res.send({msg: req.session.loggedIn})
});


router.post('/check', function(req, res) {
    res.send({msg: req.session.loggedIn})
});



/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var andrewId = req.body.andrewId;
    var problem = req.body.problem;
    var timestamp = req.body.timestamp;

    console.log("andrewId is ----------- " + andrewId);

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "problem" : problem,
        "andrewId" : andrewId,
        "timestamp": timestamp,
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // If it worked, set the header so the address bar doesn't still say /adduser
            res.location("userlist");
            // And forward to success page
            res.redirect("userlist");
        }
    });
});

module.exports = router;
