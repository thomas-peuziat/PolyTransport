var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', require('connect-ensure-login').ensureLoggedIn('/3D/connexion'), function(req, res, next) {
    res.sendFile('accueil.html',  {'root': 'public/views/trajet'});
    
});

router.post('/', require('connect-ensure-login').ensureLoggedIn('/3D/connexion'), function(req, res, next) {
    res.sendFile('accueil.html', {'root': 'public/views/trajet'});
});


module.exports = router;
module.exports.isLog = false;