let express = require('express');
let router = express.Router();
let fetch = require('node-fetch');
let isLog = require('./index').isLog;
let template = require('../template.js');

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
    if (response.ok) {
        console.log(isLog);
    }
    else
        console.log('nok');
});

router.get('/', require('connect-ensure-login').ensureLoggedIn(), function(req, res, next) {
    // @ TODO: render template login.mustache
    template.renderTemplate(template.templates('http://127.0.0.1:8080/public/templates/login.mustache'), {})
        .then(body => res.send(body))
        .catch(error => console.log("erreur" + error));
});

module.exports = router;