/* eslint-env node */
'use strict';

// Ce module nodejs gère l'API de notre site
// Il définit l'ensemble des routes (relative à "/api") corresponant aux
// points d'entrée de l'API

// Expressjs
const express = require('express');
// Notre module nodejs d'accès simplifié à la base de données
const dbHelper = require('./dbhelper.js');

// Comme c'est un module nodejs il faut exporter les fonction qu'on veut rendre publiques
// ici on n'exporte qu'ne seule fonction (anonyme) qui est le "constructeur" du module
// Cette fonction prend en paramètre un objet "passport" pour la gestion de l'authentification
module.exports = (passport) => {
    const app = express();

    // Point d'entrée pour la connexion
    app.post('/connexion', function (req, res, next) {
        if (!req.body.username)
            return res.send({success: false, message: 'empty username'});
        if (!req.body.password)
            return res.send({success: false, message: 'empty password'});

        passport.authenticate('local', function (err, user) {
            if (err) {
                return next(err); // will generate a 500 error
            }
            if (!user) {
                return res.send({succes: false, message: 'authentication failed'});
            }
            req.login(user, function (err) {
                
                if (err) {
                    return next(err);
                }
                return res.send({success: true, message: 'authentication succeeded'});
            });
        })(req, res, next);
    });


<<<<<<< HEAD
    app.post('/inscription', function (req, res, next) {
        if (!req.body.nom)
            return res.send({success: false, message: 'empty name'});
        if (!req.body.prenom)
            return res.send({success: false, message: 'empty surname'});
        if (!req.body.email)
            return res.send({success: false, message: 'empty mail'});
        if (!req.body.phone)
            return res.send({success: false, message: 'empty phone'});
        if (!req.body.password)
            return res.send({success: false, message: 'empty password'});
        if (!req.body.passwordVerif)
            return res.send({success: false, message: 'empty password verification'});

        dbHelper.users.create(req.body.nom, req.body.prenom, req.body.email, req.body.phone, req.body.photo, req.body.password).then(
            result => {
                res.send({success: true});                  
            },
            err => {
                res.send({success: false, message: 'bad request'});
                next(err);
            },
        );
    });

=======
    // Point d'entrée pour la recherche de trajet
    app.post('/search-trajet', function (req, res, next) {
        if (!req.body.lieu_depart || !req.body.lieu_arrivee || !req.body.date_depart || !req.body.heure_depart)
            return res.send({success: false, message: 'Informations manquantes'});

        return res.send({success: true});
    });

    // @TODO: liste-trajets


    //Point d'entrée pour la recherche de trajet
    app.post('/propose-trajet', function(req, res, next){
        if(!req.body.lieu_depart || !req.body.lieu_arrivee || !req.body.date_depart || !req.body.heure_depart || !req.body.modele_voiture || !req.body.nbPassagers)
            return res.send({success: false, message: 'Informations manquantes'});
        return res.send({success: true});
    });
    
>>>>>>> 95ab8eb74246ab9182a10069e5d40ed13f280a99
    return app;

};