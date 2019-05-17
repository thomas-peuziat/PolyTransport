let express = require('express');
let router = express.Router();
let fetch = require('node-fetch');

router.post('/', async function() {
    console.log('coc');
    let response;
    response = await fetch('http://127.0.0.1:8080/api/connexion', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        method: 'POST',
        body: 'username=f&password=f',
    });
    console.log('coc');
    if (response.ok)
        console.log(response);
    else
        console.log("nok");
});

router.get('/', function(req, res, next) {
    // @ TODO: render template login.mustache
    res.send({success: true, message: 'ok'});
});

module.exports = router;