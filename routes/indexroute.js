var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res, next) {
    
});

router.post('/', require('connect-ensure-login').ensureLoggedIn('/connexion'), function(req, res, next) {
    res.sendfile('login1.html', {'root': 'public/views/'});
});


module.exports = router;
module.exports.isLog = false;