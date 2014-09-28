var express = require('express');
var router = express.Router();
var util = require('util');
var querystring = require('querystring');
/* GET home page. */
router.post('/', function(req, res) {
	res.send(util.inspect(req.body));
	//res.send('respond with a resource');
});
module.exports = router;
