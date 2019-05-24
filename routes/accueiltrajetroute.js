let express = require('express');
let router = express.Router();

router.get('/', require('connect-ensure-login').ensureLoggedIn('/connexion'), function(req, res, next) {
    res.sendFile('accueil-trajet.html',  {'root': 'public/views/trajet'});
});

router.post('/', require('connect-ensure-login').ensureLoggedIn('/connexion'), function(req, res, next) {
    
});

module.exports = router;