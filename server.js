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
const proposerRouter = require('./routes/proposerroute'); //added
// on met en place une authentification valide pour toute le site
const passport = auth(app);

// l'api d'accès aux données sera disponible sous la route "/api"
app.use('/api', api(passport));

// Le contenu statique public sera lu à partir du repertoire 'public'
app.use('/public', express.static('public'));


app.use('/', indexRouter);
app.use('/connexion', connexionRouter);
app.use('/inscription', inscriptionRouter);
app.use('/trajet', trajetRouter);
app.use('/proposertrajet', proposerRouter); //added

<<<<<<< HEAD
// Pour toutes les autres url (catch all) on renverra l'index.html
// c'est le routeur coté client qui fera alors le routing
// app.use(function (req, res) {
//     console.log('all');
//     template.renderTemplate(template.templates('http://127.0.0.1:8080/public/views/login.mustache'), {})
//         .then(body => res.send(body))
//         .catch(error => console.log("erreur" + error));
// });
=======
// Erreur 404
app.use(function (req, res) {
    res.status(404).send("<h1>Erreur 404: Route inexistante</h1>" +
        "<a href='/trajet/accueil'>Retour à l'accueil</a>");
});
>>>>>>> 95ab8eb74246ab9182a10069e5d40ed13f280a99

// Lancement du serveur web
const server = app.listen(8080, function () {
    let port = server.address().port;
    console.log('My app is listening at http://127.0.0.1:%s', port);
});
