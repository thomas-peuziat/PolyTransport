let express = require('express');
let router = express.Router();
let fetch = require('node-fetch');

router.post('/', async function(req, res, next) {
    console.log(req.body);
    let response;
    response = await fetch('http://127.0.0.1:8080/api/connexion', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        method: 'POST',
        body: 'username=' + encodeURIComponent(req.body.mail) + '&password=' + encodeURIComponent(req.body.password),
    });
    if (response.ok)
        console.log('ok');
    else
        console.log('nok');
});

router.get('/', function(req, res, next) {
    // @ TODO: render template login.mustache
    res.send({success: true, message: 'ok'});
});

module.exports = router;