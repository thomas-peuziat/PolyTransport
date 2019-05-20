let express = require('express');
let router = express.Router();
let fetch = require('node-fetch');
let template = require('../template.js');

const templates = (() => {
    let templates = {};
    return function load(url) {
        if (templates[url]) {
            return Promise.resolve(templates[url]);
        }
        else {
            return fetch(url)
                .then(res => res.text())
                .then(text => {
                    return templates[url] = text;
                })
        }
    }
})();

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

    //template.templates('http://127.0.0.1:8080/public/templates/login.mustache');



    template.renderTemplate(template.templates('http://127.0.0.1:8080/public/templates/login.mustache'), {})
        .then(body => res.send(body))
        .catch(error => console.log("erreur" + error));

    /*renderLoginPage()
        .catch( (error) => {
            console.log("ça marche pas " + error.message);
        });

    // fonction interne d'affichage de la page
    async function renderNavbarPage() {
        fetch('http://127.0.0.1:8080/public/templates/navbar.mustache')
            .then(res => res.text())
            .then(body => {
                res.send(body)
            });
    }

    async function renderLoginPage() {
            fetch('http://127.0.0.1:8080/public/templates/login.mustache')
                .then(res => {
                    return res.text();

                })
                .then(body => {
                    res.send(body);
                })
                .catch((error) => {
                    console.log('nul:' + error)
                });
    }*/


});

module.exports = router;