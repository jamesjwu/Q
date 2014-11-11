var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
      res.send('respond with a resource');
});

router.get('/userlist', function(req, res) {
    var db = req.db;
    db.collection('userlist').find().toArray(function (err, items) {
        res.json(items);
    });
});



router.post('/adduser', function(req, res) {
    var db = req.db;
    var andrewId = req.body.andrewId
    var cursor = db.collection('userlist').find({"andrewId" : andrewId}).toArray(function (err, items) {
        if(items.length > 0) {
            res.send({msg: "You can't add yourself twice in a row to the queue!"});
            return;
        }
        else {
            db.collection('userlist').insert(req.body, function(err, result) {
                res.send(
                    (err === null) ? {msg: ''} : {msg: err}
                    );
            });
        }
    })


});


router.get('/gettimes', function(req, res) {
    var db = req.db;
    db.collection('times').find().toArray(function (err, items) {
        res.json(items);
    });
});


router.post('/tracktime', function(req, res) {
    var db = req.db;
    db.collection('times').insert(req.body, function(err, result) {
        res.send(
            (err === null) ? {msg: ''} : {msg: err}
            );
    });
});

router.delete('/deleteuser/:id', function(req, res) {
    console.log(req.session.loggedIn);
    if (req.session.loggedIn === true) {
        var db = req.db;
        var userToDelete = req.params.id;
        db.collection('userlist').removeById(userToDelete, function(err, result) {
            res.send((result === 1) ? {msg: ''} : {msg:'error: ' + err});
        });
    } else {
        res.send({msg: 'You cannot delete because you have not logged in as a TA'});
    }
});

module.exports = router;
