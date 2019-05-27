/* eslint-env node */
'use strict';

// Ce module nodejs gère l'API de notre site
// Il définit l'ensemble des routes (relative à "/api") corresponant aux
// points d'entrée de l'API

// Expressjs
const express = require('express');
const dbhelper = require('./dbhelper.js');
// Notre module nodejs d'accès simplifié à la base de données
//const dbHelper = require('./dbhelper.js');

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


    // Point d'entrée pour la recherche de trajet
    app.get('/search-trajet', function (req, res, next) {
        if (!req.body.lieu_depart || !req.body.lieu_arrivee || !req.body.heure_depart)
            return res.send({success: false, message: 'Informations manquantes'});

        dbhelper.trajets.byLieuDepArrHeure(req.body.lieu_depart, req.body.lieu_arrivee, req.body.heure_depart)
            .then((response) => {
                /*let trajets = {
                    prix: response.prix,
                    nbPlaces: response.Nb_places,
                    conducteur: {
                        nom: '',
                        prenom: ''
                    },
                    depart: {
                        lieu:'',
                        heure:''
                    },
                    arrivee: {
                        lieu:'',
                        heure:''
                    },
                };
                let idConducteur = response.Id_conducteur;

                let idLieuDepart = response.Id_lieu_depart;
                let idLieuArrivee = response.Id_lieu_arrivee;

                dbhelper.users.byIdGetName(idConducteur)
                    .then((response) => {
                        trajets.
                    });
                */
                return res.send({success: true, trajets: trajets});
            });

        return res.send({success: false, message: 'Erreur, rien ne va plus'});
    });


    return app;

};