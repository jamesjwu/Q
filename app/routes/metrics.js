var express = require('express');
var router = express.Router();


router.get('/getmetrics', function (req, res) {
	if(!req.session.loggedin) {
		res.send({msg:"Nice try."});
		return;
	}

	var db = req.db;
	db.collection('metrics').find({"timestamp": {$gt : req.body.startTime, $lt : req.body.endTime}}).toArray(function (err, items) {
        res.json(items);
    });
    
});