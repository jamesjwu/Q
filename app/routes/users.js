var express = require('express');
var router = express.Router();
var fs = require('fs');
var students = fs.readFileSync('studentIDs.txt').toString().split('\n')
var queueFrozen = false


/* GET users listing. */
router.get('/', function(req, res) {
      res.send('respond with a resource');
});

function sanitizeString(str){
    return str.replace(/[^a-z0-9áéíóúñü()'"_-\s\.,]/gim,"").trim();
}


router.get('/userlist', function(req, res) {
    var db = req.db;
    db.collection('userlist').find().toArray(function (err, items) {
        items.sort(function(a,b) {
            return a.timestamp - b.timestamp
        });
        res.json(items);
    });
});


router.post('/freezequeue', function(req, res) {
    if(req.session.loggedIn) {
        queueFrozen = !queueFrozen
        if(queueFrozen) {
            res.send({msg: 'Queue frozen'})
        }
        else {
            res.send({msg: 'Queue unfrozen'})
        }
    }

    else {
        res.send({msg: 'Nice try'});
    }
})



router.post('/adduser', function(req, res) {
    if(queueFrozen) {
        res.send({msg: 'Sorry, the TAs have frozen the queue!'})
        return
    }
    var db = req.db;
    var andrewId = req.body.andrewId

    if(students.indexOf(andrewId) < 0) {
        res.send({msg: "Your andrewID isn't associated with 15122!"})
        return
    }
    var cursor = db.collection('userlist').find({"andrewId" : andrewId}).toArray(function (err, items) {
        if(items.length > 0) {
            res.send({msg: "You can't add yourself twice in a row to the queue!"});
            return;
        }
        else {

            var user = req.body
            user.timestamp = new Date().getTime()
            user.name = sanitizeString(req.body.name)
            user.andrewId = sanitizeString(req.body.andrewId)
            user.problem = sanitizeString(req.body.problem)


            // insert the data into our metrics database
            db.collection('metrics').insert(user, function(err, result) {})
            db.collection('userlist').insert(user, function(err, result) {
                if(err) {
                    res.send({msg:err, success: false});
                }
                else {
                    // if input had to be sanitized
                    res.send({msg:'Entered the queue!', success: true, user: result})
                }
            });
        }
    })


});


router.get('/cleartimes', function(req, res) {
    
    if(req.session.loggedIn) {
        var db = req.db
        db.collection('times').drop()
        db.collection('userlist').drop()
        res.send({msg:"Done"})
    }

    else {
        res.send({msg: "Nice Try"})
    }

})

router.get('/gettimes', function(req, res) {
    var db = req.db;
    db.collection('times').find().toArray(function (err, items) {
        res.json(items);
    });
});


router.post('/tracktime', function(req, res) {
    var db = req.db;
    db.collection('archive').insert(req.body, function(err, result){});
    db.collection('times').insert(req.body, function(err, result) {
        res.send(
            (err === null) ? {msg: ''} : {msg: err}
            );
    });
    
});

router.delete('/deleteuser/:id', function(req, res) {
    // Check log in 
    if(req.session.loggedIn) {
        var db = req.db;
        var userToDelete = req.params.id;
        db.collection('userlist').removeById(userToDelete, function(err, result) {
            res.send((result === 1) ? {msg: ''} : {msg:'error: ' + err});
        });
    }
    else 
    {
        res.send({msg :'Nice try.'});
    }
});

module.exports = router;
