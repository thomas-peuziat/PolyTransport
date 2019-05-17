var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.send({success: true, message: 'ok'});
});

router.post('/', function(req, res, next) {
    res.send({succes: true, message: 'ok'});
});

module.exports = router;