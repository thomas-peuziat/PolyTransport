let express = require('express');
let router = express.Router();

router.get('/accueil',require('connect-ensure-login').ensureLoggedIn('/connexion'), function(req, res, next) {
    res.sendFile('accueil.html',  {'root': 'public/views/trajet'});
});

router.post('/', require('connect-ensure-login').ensureLoggedIn('/connexion'), function(req, res, next) {

});

router.get('/rechercher', require('connect-ensure-login').ensureLoggedIn('/connexion'), function(req, res, next) {
    res.sendFile('rechercher-trajet.html',  {'root': 'public/views/trajet'});
});

router.get('/proposer', require('connect-ensure-login').ensureLoggedIn('/connexion'), function(req, res, next) {
    res.sendFile('proposer-trajet.html',  {'root': 'public/views/trajet'});
});

router.get('/liste-trajets', require('connect-ensure-login').ensureLoggedIn('/connexion'), function(req, res, next) {
    res.sendFile('liste-trajets.html',  {'root': 'public/views/trajet'});
});

module.exports = router;