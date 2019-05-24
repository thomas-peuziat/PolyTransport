let express = require('express');
let router = express.Router();
//const accueil = require('../public/js/conn_get');
//const conn = require('../public/js/conn');

router.post('/', function(req, res, next) {

});

router.get('/', function(req, res, next) {
    res.sendFile('login.html',  {'root': 'public/views'});
});

module.exports = router;