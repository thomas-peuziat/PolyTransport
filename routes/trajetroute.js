let express = require('express');
let router = express.Router();

router.get('/accueil', function(req, res, next) {
    res.sendFile('accueil.html',  {'root': 'public/views/trajet'});
});

router.get('/rechercher', function(req, res, next) {
    res.sendFile('rechercher-trajet.html',  {'root': 'public/views/trajet'});
});

router.get('/proposer', function(req, res, next) {
    res.sendFile('proposer-trajet.html',  {'root': 'public/views/trajet'});
});

router.get('/liste-trajets', function(req, res, next) {
    res.sendFile('liste-trajets.html',  {'root': 'public/views/trajet'});
});

module.exports = router;