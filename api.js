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
    // TODO: Faire en sorte que la recherche ne se fasse pas que sur la ville précise
    app.get('/search-trajet/:lieu_depart/:lieu_arrivee/:heure_depart', function (req, res, next) {
        if (!req.params.lieu_depart || !req.params.lieu_arrivee || !req.params.heure_depart)
            return res.send({success: false, message: 'Informations manquantes'});

        let villeDep = req.params.lieu_depart;
        let villeArr = req.params.lieu_arrivee;
        let heureDep = req.params.heure_depart;

        // Get ID ville départ
        dbHelper.lieu.byVille(villeDep)
            .then(responseDep => {
                let id_lieu_depart = responseDep.Id_lieu;

                // Get ID ville arrivée
                dbHelper.lieu.byVille(villeArr)
                    .then(responseArr => {
                        let id_lieu_arrivee = responseArr.Id_lieu;

                        // Get ID conducteur, Prix, Heure_Arrivee
                        dbHelper.trajets.byLieuDepArrHeure(id_lieu_depart, id_lieu_arrivee, heureDep)
                            .then((response) => {

                                let promises = [];

                                // Get tous les conducteurs des trajets
                                response.forEach(function (trajet){
                                    let conducteur = [trajet.Id_trajet];

                                    promises.push(
                                        new Promise(resolve => {

                                            // Get conducteur
                                            dbHelper.users.byIdGetName(trajet.Id_conducteur)
                                                .then(function(res) {
                                                    res.Id_conducteur = trajet.Id_conducteur;
                                                    conducteur.push(res);
                                                    resolve(conducteur);
                                                });
                                        })
                                    );
                                });

                                Promise.all(promises)
                                    .then((conducteurs) => {

                                        let mapTrajetConducteur = new Map(conducteurs);

                                        let trajets = [];

                                        response.forEach(function (trajet_bd) {
                                            let heureDepText = heureIntToText(trajet_bd.Heure);
                                            let heureArrText = heureIntToText(trajet_bd.Heure_Arrivee);

                                            let trajet = {
                                                prix: trajet_bd.Prix,
                                                nbPlaces: trajet_bd.Nb_places,
                                                conducteur: {
                                                    nom: mapTrajetConducteur.get(trajet_bd.Id_trajet).Nom,
                                                    prenom: mapTrajetConducteur.get(trajet_bd.Id_trajet).Prenom,
                                                    //vehicule: mapTrajetConducteur.get(trajet_bd.Id_trajet).Id_vehicule
                                                    //id: mapTrajetConducteur.get(trajet_bd.Id_trajet).id
                                                },
                                                depart: {
                                                    lieu:villeDep,
                                                    heure:heureDepText
                                                },
                                                arrivee: {
                                                    lieu:villeArr,
                                                    heure:heureArrText
                                                },
                                            };
                                            trajets.push(trajet);

                                        });

                                        // On renvoit le json contenant les trajets à afficher sur liste-trajets
                                        if(trajets.length > 0) {
                                            return res.send({
                                                success: true,
                                                trajets: trajets
                                            });
                                        } else {
                                            return res.send({
                                                success: false,
                                                message: 'Aucun trajet disponible'
                                            });
                                        }
                                    });
                            })
                            .catch(function () {
                                return res.send({
                                    success: false,
                                    message: 'Pas de trajet disponible'
                                });
                            });
                    })
                    .catch(function () {
                        return res.send({
                            success: false,
                            message: 'Lieu arrivée inexistant'
                        });
                    });
            })
            .catch(function () {
                return res.send({
                    success: false,
                    message: 'Lieu départ inexistant\n'
                });
            });
    });


    //Point d'entrée pour l'ajout de trajet
    app.post('/propose-trajet', function(req, res, next){
        if(!req.body.lieu_depart || !req.body.lieu_arrivee || !req.body.prix || !req.body.heure_depart || !req.body.nbPlaces)
            return res.send({success: false, message: 'Informations manquantes'});
        
        let idConducteur = req.session.passport.user;        //Récupérer l'id conducteur

        dbHelper.lieu.byVille(req.body.lieu_depart).then( idLieuDep => {
            if(typeof idLieuDep === "undefined"){
                //inserer en bdd + getId
            }
            dbHelper.lieu.byVille(req.body.lieu_arrivee).then(idLieuArr =>{
                if(typeof idLieuArr === "undefined"){
                    //inserer en bdd + getId
                }
                dbHelper.trajets.create(0, null, null, 0, req.body.prix, 0, '', req.body.heure_depart, 0,
                    idLieuDep.Id_lieu, idLieuArr.Id_lieu, idConducteur, req.body.nbPlaces)
                    .then(
                        result => {
                            console.log("succes ajout BDD");
                            res.send({success: true});                  
                        },
                        err => {
                            console.log("erreur ajout BDD");
                            res.send({success: false, message: 'bad request'});
                            next(err);
                        },
                    ).catch(function(error){
                        return res.send({succes: false, message: "ErreurAjout "+error});
                    });

            }).catch(function(error){
                return res.send({success: false, message: "Ville d'arrivée inexistante "+error});
            });
        }).catch(function(error){
            return res.send({success: false, message: "Ville de départ inexistante "+error});
        });
    });
    
    return app;

};

function heureIntToText(heureInt) {
    let heureString = heureInt.toString();
    let heureText = '';
    if(heureString.length === 1) {
        heureText = '00:0' + heureString;
    } else if (heureString.length === 2) {
        heureText = '00:' + heureString;
    } else if (heureString.length === 3) {
        heureText = '0' + heureString[0] + ':' + heureString[1] + heureString[2];
    } else if (heureString.length === 4) {
        heureText = heureString[0] + heureString[1]  + ':' + heureString[2] + heureString[3];
    }
    return heureText;
}