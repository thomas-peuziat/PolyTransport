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
const messagesRouter = require('./routes/messagesroute');
// on met en place une authentification valide pour toute le site
const passport = auth(app);

app.use('/3D/api/', api(passport));

// Le contenu statique public sera lu à partir du repertoire 'public'
app.use('/3D/public/', express.static('public'));


app.use('/3D/', indexRouter);
app.use('/3D/connexion/', connexionRouter);
app.use('/3D/inscription', inscriptionRouter);
app.use('/3D/trajet/', require('connect-ensure-login').ensureLoggedIn('/3D/connexion/'), trajetRouter);
app.use('/3D/profil/', require('connect-ensure-login').ensureLoggedIn('/3D/connexion/'), profilRouter);
app.use('/3D/messages/', require('connect-ensure-login').ensureLoggedIn('/3D/connexion/'), messagesRouter);
//app.use('/proposertrajet', proposerRouter); //added

// Erreur 404
app.use(function (req, res) {
    res.status(404).send("<h1>Erreur 404: Route inexistante</h1>" +
        "<a href='/3D/trajet/accueil'>Retour à l'accueil</a>");
});

let port = 'PORT' in process.env ? process.env.PORT: 8080;

// Lancement du serveur web
const server = app.listen(port, function () {
    let port = server.address().port;
    let host = server.address().address;

    console.log('My app is listening at http://%s:%s/3D/', host, port);
});
