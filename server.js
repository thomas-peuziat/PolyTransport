/* eslint-env node */
'use strict';

// Ceci est notre scirpt principal, celui qui va lancer le serveur web

// imports d'express
const express = require('express');
const app = express();
// et de nos modules à nous !
const api = require('./api.js');
const auth = require('./auth.js');
const template = require('./template');

const indexRouter = require('./routes/indexroute');
const connexionRouter = require('./routes/connexionroute');
const inscriptionRouter = require('./routes/inscriptionroute');

// on met en place une authentification valide pour toute le site
const passport = auth(app);

// l'api d'accès aux données sera disponible sous la route "/api"
app.use('/api', api(passport));

// Le contenu statique public sera lu à partir du repertoire 'public'
app.use('/public', express.static('public'));


app.use('/', indexRouter);
app.use('/connexion', connexionRouter);
app.use('/inscription', inscriptionRouter);

// Le contenu statique privé sera lu à partir du repertoire 'private'
// dans cet exemple, il s'agit principalement des templates de la partie admin
// on vérifie ici que l'utilisateur est bien authentifié
app.use('/private',
    require('connect-ensure-login').ensureLoggedIn(),
    express.static('private')
);



// Pour toutes les autres url (catch all) on renverra l'index.html
// c'est le routeur coté client qui fera alors le routing
app.use(function (req, res) {
    console.log('all');
    template.renderTemplate(template.templates('http://127.0.0.1:8080/public/views/login.mustache'), {})
        .then(body => res.send(body))
        .catch(error => console.log("erreur" + error));
});

// Lancement du serveur web
const server = app.listen(8080, function () {
    let port = server.address().port;
    console.log('My app is listening at http://127.0.0.1:%s', port);
});
