/* eslint-env node */
'use strict';

// Ceci est notre scirpt principal, celui qui va lancer le serveur web

// imports d'express
const express = require('express');
const app = express();
// et de nos modules à nous !
const api = require('./api.js');
const auth = require('./auth.js');

const indexRouter = require('./routes/indexroute');
const connexionRouter = require('./routes/connexionroute');
const inscriptionRouter = require('./routes/inscriptionroute');
const trajetRouter = require('./routes/trajetroute');
const profilRouter = require('./routes/profilroute');
// on met en place une authentification valide pour toute le site
const passport = auth(app);

// l'api d'accès aux données sera disponible sous la route "/api"
app.use('/api', api(passport));

// Le contenu statique public sera lu à partir du repertoire 'public'
app.use('/public', express.static('public'));


app.use('/', indexRouter);
app.use('/connexion', connexionRouter);
app.use('/inscription', inscriptionRouter);
app.use('/trajet', require('connect-ensure-login').ensureLoggedIn('/connexion'), trajetRouter);
app.use('/profil', require('connect-ensure-login').ensureLoggedIn('/connexion'), profilRouter)
//app.use('/proposertrajet', proposerRouter); //added

// Erreur 404
app.use(function (req, res) {
    res.status(404).send("<h1>Erreur 404: Route inexistante</h1>" +
        "<a href='/trajet/accueil'>Retour à l'accueil</a>");
});

// Lancement du serveur web
const server = app.listen(8080, function () {
    let port = server.address().port;
    console.log('My app is listening at http://127.0.0.1:%s', port);
});
