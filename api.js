/* eslint-env node */
'use strict';

// Ce module nodejs gère l'API de notre site
// Il définit l'ensemble des routes (relative à '/api') corresponant aux
// points d'entrée de l'API

// Expressjs
const express = require('express');
// Notre module nodejs d'accès simplifié à la base de données
const dbHelper = require('./dbhelper.js');

// Comme c'est un module nodejs il faut exporter les fonction qu'on veut rendre publiques
// ici on n'exporte qu'ne seule fonction (anonyme) qui est le 'constructeur' du module
// Cette fonction prend en paramètre un objet 'passport' pour la gestion de l'authentification
module.exports = (passport) => {
    const app = express();

    // Point d'entrée pour la connexion
    app.post('/connexion/', function (req, res, next) {
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


    app.post('/inscription/', function (req, res, next) {
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

    app.get('/profil/:id_usr/', function (req, res, next) {
        dbHelper.users.vehiculeById(req.params.id_usr).then(
            id_vehicule => {
                if(id_vehicule.Id_vehicule !== null) {
                    dbHelper.users.infosById(req.params.id_usr, id_vehicule.Id_vehicule).then(
                        infos => {
                            res.set('Content-type', 'application/json');
                            res.send(JSON.stringify(infos));
                        },
                        err => {
                            next(err);
                        },
                    );
                }else {
                    dbHelper.users.infosByIdSansV(req.params.id_usr).then(
                        infos => {
                            res.set('Content-type', 'application/json');
                            res.send(JSON.stringify(infos));
                        },
                        err => {
                            next(err);
                        },
                    );
                }

            },
            err => {
                next(err);
            },
        );


    });

    app.put('/profil/:id_usr/', function (req, res, next) {
        // if (!req.body.nom || !req.body.prenom || !req.body.email || !req.body.phone || !req.body.DDN)
        //     return res.send({success: false, message: 'Informations manquantes'});
        if (req.body.marque) {
            dbHelper.vehicule.search(req.body.marque, req.body.modele, req.body.annee).then(result => {
                let data = JSON.stringify(result);
                if (typeof data === 'undefined') {
                    dbHelper.vehicule.create(req.body.marque, req.body.modele, req.body.annee).then(result => {
                        dbHelper.vehicule.search(req.body.marque, req.body.modele, req.body.annee).then(result => {
                            dbHelper.users.update(req.params.id_usr, req.body.nom, req.body.prenom, req.body.email, req.body.phone, req.body.DDN, result.Id_vehicule).then(
                                result => {
                                    res.send({success: true, message: 'Mise à jour de votre profil'});
                                },
                                err => {
                                    res.send({success: false, message: 'bad request'});
                                    next(err);
                                },
                            ).catch(function(error){
                                return res.send({success: false, message: 'Erreur Base de données '+ error});
                            });
            
                        }).catch(function(error){
                            return res.send({success: false, message: 'Erreur Base de données '+ error});
                        });
        
                    }).catch(function(error){
                        return res.send({success: false, message: 'Erreur Base de données '+ error});
                    });
    
                } else {
                    dbHelper.users.update(req.params.id_usr, req.body.nom, req.body.prenom, req.body.email, req.body.phone, req.body.DDN, result.Id_vehicule).then(
                        result => {
                            res.send({success: true, message: 'Mise à jour de votre profil'});
                        },
                        err => {
                            res.send({success: false, message: 'bad request'});
                            next(err);
                        },
                    ).catch(function(error){
                        return res.send({success: false, message: 'Erreur Base de données '+ error});
                    });
    
                }
            });
        } else {
            dbHelper.users.updateSansV(req.params.id_usr, req.body.nom, req.body.prenom, req.body.email, req.body.phone, req.body.DDN).then(
                result => {
                    res.send({success: true, message: 'Mise à jour de votre profil'});
                },
                err => {
                    res.send({success: false, message: 'bad request'});
                    next(err);
                },
            ).catch(function(error){
                return res.send({success: false, message: 'Erreur Base de données '+ error});
            });
        }
        
    });

    app.get('/trajet/:id_trajet/', function (req, res, next) {
        if(!req.params.id_trajet)
            return res.send({success: false, message: 'Informations manquantes'});

        let id_trajet = req.params.id_trajet;
        dbHelper.trajets.byId(id_trajet)
            .then((resTrajet) => {
                if(!resTrajet) {
                    return res.send({
                        success: false,
                        message: 'Trajet inexistant'
                    });
                }

                let promises = [];

                promises.push(
                    new Promise(resolve => {
                        // Get ville depart
                        dbHelper.lieu.byId(resTrajet.Id_lieu_depart)
                            .then(function(lieu) {
                                resolve(['depart', lieu.Ville]);
                            })
                    })
                );

                promises.push(
                    new Promise(resolve => {
                        // Get ville arrivee
                        dbHelper.lieu.byId(resTrajet.Id_lieu_arrivee)
                            .then(function(lieu) {
                                resolve(['arrivee', lieu.Ville]);
                            })
                    })
                );

                promises.push(
                    new Promise(resolve => {
                        // Get conducteur
                        dbHelper.users.byIdGetName(resTrajet.Id_conducteur)
                            .then(function(user) {
                                resolve(['conducteur', {
                                    nom: user.Nom,
                                    prenom: user.Prenom,
                                    vehicule: {
                                        id: user.Id_vehicule
                                    },
                                    image: user.Image
                                }]);
                            })
                    })
                );

                Promise.all(promises)
                    .then((promisesRes) => {
                        let mapRes = new Map(promisesRes);
                        let heureDepText = heureIntToText(resTrajet.Heure);
                        let heureArrText = heureIntToText(resTrajet.Heure_Arrivee);

                        let vehiculePromise = new Promise(resolve => {

                            // Get vehicule
                            dbHelper.vehicule.byId(mapRes.get('conducteur').vehicule.id)
                                .then((vehicule) => {
                                    resolve({
                                        id: mapRes.get('conducteur').vehicule.id,
                                        marque: vehicule.Marque,
                                        modele: vehicule.Modele,
                                        annee: vehicule.Annee,
                                        image: vehicule.Image
                                    });
                                })
                                .catch(() => {
                                    resolve({});
                                });
                        });

                        vehiculePromise
                            .then((vehicule) => {
                                let trajet = {
                                    prix: resTrajet.Prix,
                                    nbPlaces: resTrajet.Nb_places,
                                    conducteur: {
                                        nom: mapRes.get('conducteur').nom,
                                        prenom: mapRes.get('conducteur').prenom,
                                        vehicule: vehicule,
                                        image: mapRes.get('conducteur').image,
                                        id: resTrajet.Id_conducteur
                                    },
                                    depart: {
                                        lieu: mapRes.get('depart'),
                                        heure: heureDepText
                                    },
                                    arrivee: {
                                        lieu: mapRes.get('arrivee'),
                                        heure: heureArrText
                                    },
                                };

                                return res.send({
                                    success: true,
                                    trajet: trajet
                                });
                            });
                    });
            })
            .catch(function () {
                return res.send({
                    success: false,
                    message: 'Trajet inexistant'
                });
            });

    });

    app.post('/trajet/reserver/', function(req, res, next){
        let idTrajet = req.body.id_trajet;

        //on récupère le nombre de places disponibles et on vérifie que le trajet n'est pas à nous
        dbHelper.trajets.byId(idTrajet)
        .then(resultat => {
            if(resultat.Id_conducteur === req.session.passport.user) {
                return res.send({success: false, messageErreur: 'Vous ne pouvez pas réserver pour votre trajet'});
            }
            if(resultat.Nb_places > 0){
                dbHelper.passager.byIds(req.session.passport.user, idTrajet)
                .then(resReq => {
                    //si l'user a déjà reservé pour ce trajet
                    if(typeof resReq !== "undefined" && resReq.Id_usr === req.session.passport.user){
                        return res.send({success: false, messageErreur: 'Vous avez déjà réservé pour ce trajet'});
                    }
                    else{
                        //MAJ du nombre de places disponible
                        dbHelper.trajets.updateNbPlaces(idTrajet, resultat.Nb_places-1)
                        .then(()=>{
                            //on créé un nouveau passager
                            dbHelper.passager.create(req.session.passport.user, idTrajet)
                            .then(()=>{
                                return res.send({success: true, messageValide: 'Réservation effectuée'});
                            })
                            .catch(function(error){
                                return res.send({success: false, messageErreur: 'Erreur1 Base de données '+ error});
                            });
                        })
                        .catch(function(error){
                            return res.send({success: false, messageErreur: 'Erreur2 Base de données '+ error});
                        });
                    }
                }).catch(function(error){
                    return res.send({success: false, messageErreur: 'Erreur3 Base de données '+ error});
                });

            }
            else{
                return res.send({success: false, messageErreur: 'Aucune place de libre'});

            }
        }).catch(function(error){
            return res.send({success: false, messageErreur: 'Erreur4 Base de données '+ error});
        });

    });

    // Point d'entrée pour la recherche de trajet
    // TODO: Faire en sorte que la recherche ne se fasse pas que sur la ville précise
    app.get('/search-trajet/:lieu_depart/:lieu_arrivee/:heure_depart/', function (req, res, next) {
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
                                                id: trajet_bd.Id_trajet,
                                                prix: trajet_bd.Prix,
                                                nbPlaces: trajet_bd.Nb_places,
                                                conducteur: {
                                                    nom: mapTrajetConducteur.get(trajet_bd.Id_trajet).Nom,
                                                    prenom: mapTrajetConducteur.get(trajet_bd.Id_trajet).Prenom,
                                                    //vehicule: mapTrajetConducteur.get(trajet_bd.Id_trajet).Id_vehicule
                                                    id: mapTrajetConducteur.get(trajet_bd.Id_trajet).Id_conducteur
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
                    message: 'Lieu départ inexistant'
                });
            });
    });


    //Point d'entrée pour l'ajout de trajet
    app.post('/propose-trajet/', function(req, res, next){
        if(!req.body.lieu_depart || !req.body.lieu_arrivee || !req.body.prix || !req.body.heure_depart || !req.body.nbPlaces)
            return res.send({success: false, message: 'Informations manquantes'});
        
        let idConducteur = req.session.passport.user;        //Récupérer l'id conducteur
 
        let promises = [];

        promises.push(
            new Promise(resolve => {
                dbHelper.lieu.byVille(req.body.lieu_depart)
                .then( idLieuDep => {
                    if(typeof idLieuDep === "undefined"){
                        //inserer en bdd si inexistant
                        dbHelper.lieu.create(req.body.lieu_depart)
                        .then(()=>{
                            dbHelper.lieu.byVille(req.body.lieu_depart)
                            .then(idLieuDep=>{
                                resolve(idLieuDep);
                            });
                        });
                    }else{
                        resolve(idLieuDep);
                    }
                }).catch(function(error){
                    return res.send({success: false, messageErreur: 'Erreur Base de données '+ error});
                });
            })
        );

        promises.push(
            new Promise(resolve => {
                dbHelper.lieu.byVille(req.body.lieu_arrivee)
                .then(idLieuArr =>{
                    if(typeof idLieuArr === "undefined"){
                        //inserer en bdd si inexistant
                        dbHelper.lieu.create(req.body.lieu_arrivee)
                        .then(()=>{
                            dbHelper.lieu.byVille(req.body.lieu_arrivee)
                            .then(idLieuArr=>{
                                resolve(idLieuArr);
                            });
                        });            
                    }else{
                        resolve(idLieuArr);
                    }
                }).catch(function(error){
                    return res.send({success: false, messageErreur: 'Erreur Base de données '+ error});
                });
            })
        );


        Promise.all(promises)
        .then((ids) => {
            let idLieuDep = ids[0].Id_lieu;
            let idLieuArr = ids[1].Id_lieu;
             
            dbHelper.trajets.create(0, null, null, 0, req.body.prix, 0, '', req.body.heure_depart, 0,
            idLieuDep, idLieuArr, idConducteur, req.body.nbPlaces)
            .then(
                result => {
                    res.send({success: true, messageValide: 'Votre trajet a bien été ajouté'});                  
                },
                err => {
                    res.send({success: false, messageErreur: 'bad request'});
                    next(err);
                },
            ).catch(function(error){
                return res.send({succes: false, messageErreur: 'BDD error ' +error});
            });
        });

    });


    app.get('/messages/liste-discussions/', function (req, res, next) {
        let tab_usr = [];
        let nb_amis = 0; 
        let promises = [];
        let promises2 = [];
        promises.push(
            new Promise(resolve => {
                dbHelper.message.byId(req.session.passport.user)
                .then(idusr => {
                    idusr.forEach(function (id) {
                        let found_exp = tab_usr.find(elt => elt === id.Id_usr_expediteur);
                        if (id.Id_usr_expediteur !== req.session.passport.user  && typeof found_exp === 'undefined' ) {
                            nb_amis += 1;
                            tab_usr.push(id.Id_usr_expediteur);
                        } else {
                            let found_dest = tab_usr.find(elt => elt === id.Id_usr_destinataire);
                            if (id.Id_usr_destinataire !== req.session.passport.user  && typeof found_dest === 'undefined' ) {
                                nb_amis += 1;
                                tab_usr.push(id.Id_usr_destinataire);
                            }
                        }

                    });
                    
                    resolve(tab_usr);
                });
            })
        );
        Promise.all(promises)
        .then((usr) => {
            tab_usr = [];
            let i = 0;

            for (let i = 0; i < usr[0].length; i++) {
                promises2.push(
                    new Promise(resolve => {
                        dbHelper.users.byIdGetName(usr[0][i])
                        .then(user => {
                            let data = {
                                id_usr: usr[0][i],
                                nom: user.Nom + ' ' + user.Prenom,
                            };
                            //tab_usr.push(data);
                            resolve(data);
                        });
                    })
                );
            };

            for (let i = 0; i < usr[0].length; i++) {
                promises2.push(
                    new Promise(resolve => {
                        dbHelper.message.getLastMessage(req.session.passport.user, usr[0][i])
                        .then(data => {
                            //tab_msg.push({msg: data.Message_text, Heure : data.Heure}); 
                            resolve({msg: data.Message_text, Heure : data.Heure});
                        });
                        
                    
                    })
                );     
            }               

            Promise.all(promises2)
            .then((result) => {
                let messages = [];
                for (let i = 0; i < nb_amis; i++) {
                    let data = {
                        id_usr: result[i].id_usr,
                        nom: result[i].nom,
                        msg: result[i+nb_amis].msg, 
                        Heure : result[i+nb_amis].Heure
                    }
                    messages.push(data);
                }
                if(messages.length > 0) {
                    return res.send({
                        success: true,
                        messages: messages
                    });
                } else {
                    return res.send({
                        success: false,
                        message: 'Aucun message disponible'
                    });
                }            
                
                },
                err => {
                    res.send({success: false, messageErreur: 'bad request'});
                    next(err);
                })
            .catch(function(error){
                return res.send({success: false, messageErreur: 'Erreur Base de données '+ error});
            });
        });

    });

    app.get('/messages/discussion/:id_friend/', function (req, res, next) {
        let promises = [];
        dbHelper.message.getMessages(req.session.passport.user, req.params.id_friend)
        .then( data => {
            data.forEach( function (msg) {
                promises.push(
                    new Promise(resolve => {
                        if(msg.Id_usr_expediteur === req.session.passport.user)
                            resolve({me: {text: msg.text}});
                        else
                            resolve({friend: {text: msg.text}});
                    })
                );
            });

            Promise.all(promises)
            .then(messages => {
                if(messages.length > 0) {
                    return res.send({
                        success: true,
                        message: messages,
                    });
                } else {
                    return res.send({
                        success: false,
                        message: 'Aucun message disponible',
                    });
                }
            });
        });
    });

    app.post('/trajet/notification/',function (req, res, next){
        if(!req.body.id_destinataire || !req.body.id_trajet)
            return res.send({success: false, message: 'Informations manquantes'});

        let idPassager = req.session.passport.user;
        let idDestinataire = req.body.id_destinataire;
        let idTrajet = req.body.id_trajet;

        dbHelper.passager.byIds(idPassager, idTrajet)
            .then(resReq => {
                //si le passager a bien réservé pour ce trajet
                if(typeof resReq !== "undefined" && resReq.Id_usr === idPassager){

                    dbHelper.trajets.byId(idTrajet)
                        .then((resTrajet) => {
                            if (!resTrajet) {
                                return res.send({
                                    success: false,
                                    message: 'Trajet inexistant'
                                });
                            }

                            let promises = [];

                            promises.push(
                                new Promise(resolve => {
                                    // Get ville depart
                                    dbHelper.lieu.byId(resTrajet.Id_lieu_depart)
                                        .then(function (lieu) {
                                            resolve(['depart', lieu.Ville]);
                                        })
                                })
                            );

                            promises.push(
                                new Promise(resolve => {
                                    // Get ville arrivee
                                    dbHelper.lieu.byId(resTrajet.Id_lieu_arrivee)
                                        .then(function (lieu) {
                                            resolve(['arrivee', lieu.Ville]);
                                        })
                                })
                            );

                            Promise.all(promises)
                                .then((promisesRes) => {
                                    let mapRes = new Map(promisesRes);
                                    let heureDepText = heureIntToText(resTrajet.Heure);
                                    let heureArrText = heureIntToText(resTrajet.Heure_Arrivee);
                                    let depart = {
                                        lieu: mapRes.get('depart'),
                                        heure: heureDepText
                                    };
                                    let arrivee = {
                                        lieu: mapRes.get('arrivee'),
                                        heure: heureArrText
                                    };

                                    dbHelper.users.byIdGetName(idPassager)
                                        .then((passager) => {
                                            dbHelper.message.create(idPassager, idDestinataire,
                                                '[RESERVATION TRAJET ID: ' + idTrajet + '] : ' +
                                                passager.Prenom + ' ' + passager.Nom +
                                                ' sera passager pour le trajet de ' + depart.lieu + ' (' + depart.heure + ') ' +
                                                'vers ' + arrivee.lieu + ' (' + arrivee.heure + ').')
                                                .then( () => {
                                                    return res.send({
                                                        success: true,
                                                        messageValide: 'Réservation effectuée, notifications envoyées'
                                                    });
                                                })
                                                .catch(function (error) {
                                                    return res.send({
                                                        success: false,
                                                        messageErreur: 'Réservation effectuée, problème notification :' + error
                                                    });
                                                });
                                        });
                                });
                        });
                } else {
                    return res.send({success: false, messageErreur: 'Erreur, contactez l\'administrateur :)'});
                }
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