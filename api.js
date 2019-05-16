/* eslint-env node */
'use strict';

// Ce module nodejs gère l'API de notre site
// Il définit l'ensemble des routes (relative à "/api") corresponant aux
// points d'entrée de l'API

// Expressjs
const express = require('express');
// Notre module nodejs d'accès simplifié à la base de données
//const dbHelper = require('./dbhelper.js');

// Comme c'est un module nodejs il faut exporter les fonction qu'on veut rendre publiques
// ici on n'exporte qu'ne seule fonction (anonyme) qui est le "constructeur" du module
// Cette fonction prend en paramètre un objet "passport" pour la gestion de l'authentification
module.exports = (passport) => {
    const app = express();

    // Point d'entrée pour la connexion
    app.post('/connexion', function (req, res, next) {
        // @TODO : Vérifer le nom de la variable username
        if (!req.body.username)
            return res.send({success: false, message: 'empty username'});
        // @TODO : Vérifer le nom de la variable password
        if (!req.body.password)
            return res.send({success: false, message: 'empty password'});

        passport.authenticate('local', function (err, user) {
            if (err)
                return next(err);
            if (!user)
                return res.redirect('/connexion');
            req.login(user, function (err) {
                if (err)
                    return next(err);
                return res.redirect('/index.html');
            });
        })(req, res, next);
    });

    app.get('/inscription', function (req, res) {
        if (req.session.passport.user != null)
            return res.redirect('/index.html');
        return res.redirect('/inscription')
    });

    app.post('/inscription', function (req, res) {
    
    });

    return app;

};