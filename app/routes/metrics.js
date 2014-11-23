var express = require('express');
var router = express.Router();


router.get('/getmetrics', function (req, res) {
	if(!req.session.loggedin) {
		res.send({msg:"Nice try."})
		return
	}

	var db = req.db
	db.collection('metrics').find().toArray(function (err, items) {
        res.json(items);
    });



    


})