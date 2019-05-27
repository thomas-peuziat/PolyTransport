/* eslint-env node */
'use strict';

// Ce module nodejs gère l'API de notre site
// Il définit l'ensemble des routes (relative à "/api") corresponant aux
// points d'entrée de l'API

// Expressjs
const express = require('express');
const dbhelper = require('./dbhelper.js');
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


    //Point d'entrée pour la recherche de trajet
    app.post('/propose-trajet', function(req, res, next){
        if(!req.body.lieu_depart || !req.body.lieu_arrivee || !req.body.date_depart || !req.body.heure_depart || !req.body.nbPlaces)
            return res.send({success: false, message: 'Informations manquantes'});
        
        //faire les requetes avec les données 
        let idLieuDep;
        let idLieuArr;
        let idConducteur = 0;        //Récupérer l'id conducteur

        dbHelper.lieu.byVille(req.body.lieu_depart).then( res => idLieuDep = res);

        dbHelper.lieu.byVille(req.body.lieu_arrivee).then(res => idLieuArr = res);
        
        // req.session.passport.user
        //Récupérer l'id conducteur
        // dbHelper.user.byId().then(res => idConducteur =  );
        if(idLieuArr!=null && idLieuDep!=null /*&& idConducteur != null*/){
            dbHelper.users.create(null, null, null, null, req.body.prix, null, null, req.body.heure_depart, null,
                idLieuDep, idLieuArr, idConducteur, req.body.nbPlaces)
                .then(
                    result => {
                        res.send({success: true});                  
                    },
                    err => {
                        res.send({success: false, message: 'bad request'});
                        next(err);
                    },
            );
        }
        return res.send({success: true});
    });
    
    return app;

};