var express = require('express');
var router = express.Router();
var hash = require('object-hash');
var fs = require('fs')

var coursePass = fs.readFileSync('coursePass.txt').toString()
var TAs = fs.readFileSync('TAAndrewIDs.txt').toString().split('\n')
var students = fs.readFileSync('studentIDs.txt').toString().split('\n')

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'CmuQ' });
});

router.post('/authenticate', function(req, res) {
    if ((TAs.indexOf(req.body.andrewId) >= 0)) {
        if(hash.MD5(req.body.pass) == coursePass) {
            res.send({msg: 'Welcome'});
            req.session.loggedIn = true;
        } 
        else {
            res.send({msg:"Wrong password"})
        }
    }   
    else {
        res.send({msg: "Wrong andrewID"});
    }
});




router.post('/logout', function(req, res) {
    req.session.loggedIn = false;
    res.send({msg: req.session.loggedIn})
});


router.get('/check', function(req, res) {
    res.send({msg: req.session.loggedIn})
});

/* Route to /admin for the dashboard */
router.get('/admin', function(req, res){
    res.render('admin', {title:'CmuQ'});
});


/* POST to Add User Service */
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var andrewId = req.body.andrewId;
    var problem = req.body.problem;
    var timestamp = req.body.timestamp;


    // Set our collection
    
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
