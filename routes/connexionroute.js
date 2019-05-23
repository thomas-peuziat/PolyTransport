let express = require('express');
let router = express.Router();
//const accueil = require('../public/js/conn_get');
//const conn = require('../public/js/conn');

router.post('/', async function(req, res, next) {
    // req.body.mail
    // res.sendFile('/public/views/login1.html');
});

router.get('/', function(req, res, next) {
    res.sendFile('login.html',  {'root': 'public/views/'});
});

module.exports = router;