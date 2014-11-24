var express = require('express');
var router = express.Router();
var hash = require('object-hash');
var fs = require('fs')

var coursePass = fs.readFileSync('coursePass.txt').toString()
var TAs = fs.readFileSync('TAAndrewIDs.txt').toString().split('\n')
var students = fs.readFileSync('studentIDs.txt').toString().split('\n')

var courseTitle = "CMUQ"

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'CmuQ' });
});


router.get('/getname', function(req, res) {

    res.send({msg:courseTitle})

})

function get_name() {
    return "<a href='#' class= 'brand-logo'>" + $.ajax( {
        type: "GET",
        url: "/getname",
        dataType: 'JSON',
        async: false,
    }).responseJSON.msg + "</a>"
}

router.post('/setname', function(req, res) {
    if(req.session.loggedIn) {
        courseTitle = req.body.name
        res.send({msg:'Name changed!'}) 
    }
    else {
        res.send({msg:'Nice try'})
    }
})



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
    if(req.session.loggedIn) {
        res.render('admin', {title:'CmuQ'});
    }
    else {
        res.render('index', {title: 'CmuQ'});
    }
});

module.exports = router;
