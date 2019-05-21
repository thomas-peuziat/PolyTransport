let express = require('express');
let router = express.Router();
let fetch = require('node-fetch');
var isLog = require('./index').isLog;
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
        isLog = true;
        res.redirect('public/index.html');
    }
    else {
        template.renderTemplate(template.templates('http://127.0.0.1:8080/public/templates/login.mustache'), {})
          .then(body => res.send(body))
            .catch(error => console.log("erreur" + error));
    }
});

router.get('/', function(req, res, next) {
    // @ TODO: render template login.mustache
    if (!isLog) {
        template.renderTemplate(template.templates('http://127.0.0.1:8080/public/templates/login.mustache'), {})
            .then(body => res.send(body))
            .catch(error => console.log("erreur" + error));
    }
    else {
        template.renderTemplate(template.templates('http://127.0.0.1:8080/public/templates/index.mustache'), {})
            .then(body => res.send(body))
            .catch(error => console.log("erreur" + error));
    }

});

module.exports = router;