/* eslint-env node */
'use strict';

// Ce modules fournit quelques fonction pour simplifier l'accès
// à notre base de données sqlite

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./PolyTransport.db', sqlite3.OPEN_READWRITE, function (err) {
    if (err) {
        console.error(err + '\n' + 'run "npm run createDB" to create a database file');
        // Pas de problème pour faire un appel synchrone ici : on est dans la phase
        // d'initialisation du serveur et pas dans le traitement de requêtes.
        require('process').exit(-1);
    }
});


// Rend la fonction get de l'api sqlite compatible avec les promesses
const get = sql => new Promise(function (resolve, reject) {
    db.get(sql, function (err, row) {
        if (err) {
            reject(err);
        }
        else {
            resolve(row);
        }
    });
});

const run = sql => new Promise(function (resolve, reject) {
    db.run(sql, function (err, row) {
        if (err) {
            reject(err);
        }
        else {
            resolve(row);
        }
    });
});

// Idem pour la fonction all
const all = sql => new Promise(function (resolve, reject) {
    db.all(sql, function (err, rows) {
        if (err) {
            reject(err);
        }
        else {
            resolve(rows);
        }
    });
});




// Cet export met à disposition des programmeurs 2 fonctions
// utiles pour l'authentification des utilisateurs
// dbhelper.users.byMail, qui récupère un utilisateur par son nom
// dbhelper.users.byId, qui récupère un utilisateur par son Id
module.exports.users = {
    byMail: (username) => get(`select Id_usr, MDP from UTILISATEUR where Mail = '${username}'`),
    a: Promise.resolve({
        id: 0,
        checkPassword: (/*password*/) => true,
    }),
    byId: id => get(`select Mail as username from UTILISATEUR where Id_usr = ${id}`),
    infosById: (id, id_vehicule) => get(`select Nom, Prenom, DDN, Telephone, Mail, Marque, Modele, Annee from UTILISATEUR, VEHICULE where Id_usr = ${id} and VEHICULE.Id_vehicule = ${id_vehicule} `),
    infosByIdSansV: (id) => get(`select Nom, Prenom, DDN, Telephone, Mail from UTILISATEUR where Id_usr = ${id}`),
    vehiculeById: id => get(`select Id_vehicule from UTILISATEUR where Id_usr = ${id}`),
    byIdGetName: id => get(`select Nom, Prenom, Id_vehicule from UTILISATEUR where Id_usr=${id}`),
    create: (nom, prenom, email, phone, photo, password) => run(`insert into UTILISATEUR (Telephone, Mail, Nom, Prenom, MDP, Image) values ('${phone}', '${email}', '${nom}', '${prenom}', '${password}', '${photo}')`),
    update : (id, nom, prenom, email, phone, DDN, id_v) => run(`update UTILISATEUR set Nom = '${nom}', Prenom = '${prenom}', Mail = '${email}', Telephone = '${phone}', DDN = '${DDN}', Id_vehicule = ${id_v} where Id_usr = ${id} `),
    updateSansV : (id, nom, prenom, email, phone, DDN) => run(`update UTILISATEUR set Nom = '${nom}', Prenom = '${prenom}', Mail = '${email}', Telephone = '${phone}', DDN = '${DDN}' where Id_usr = ${id} `)
};

module.exports.trajets = {
    byId: id => get(`select Kilometres, Prix, Id_paypal_paiement, Heure, Heure_Arrivee, Id_lieu_depart, Id_lieu_arrivee, Id_conducteur, Nb_Places from TRAJET 
            where Id_trajet = ${id}`),
    //ATTENTION - verifier pour Heure > ...
    byLieuDepArrHeure: (lieuDep, lieuArr, heure) =>
        all(`select Id_conducteur, Prix, Heure, Heure_Arrivee, Nb_places, Id_trajet from TRAJET 
            where Id_lieu_depart=${lieuDep} 
              and Id_lieu_arrivee=${lieuArr} 
              and Heure >= ${heure}`),
    //ATTENTION : vérifier que les id lieux et id_conducteur existent
    create: (etat, note, commentaire, km, prix, etatPaiement, idPaypalPaiement, heureDep, heureArr, idLieuDep, idLieuArr, idConducteur, nbPlace) => run(`INSERT INTO TRAJET (Etat, Note, Commentaire, Kilometres, Prix, Etat_payement, Id_paypal_paiement, Heure, Heure_Arrivee, Id_lieu_depart, Id_lieu_arrivee, Id_conducteur, Nb_places)
    VALUES (${etat}, ${note}, '${commentaire}', ${km}, ${prix}, ${etatPaiement}, '${idPaypalPaiement}', ${heureDep}, '${heureArr}', ${idLieuDep}, ${idLieuArr}, ${idConducteur}, ${nbPlace});`),
    byIdGetNbPlaces: idTrajet =>get(`select Nb_places from TRAJET where Id_trajet=${idTrajet}`),
    updateNbPlaces: (idTrajet, nbPlace) => run(`update TRAJET set Nb_places=${nbPlace} where Id_trajet=${idTrajet}`),
};

module.exports.lieu = {
    byId: id => get(`select Ville from LIEU where Id_lieu = ${id}`),
    byVille: ville => get(`select Id_lieu from LIEU where Ville = '${ville}'`),
    create: (ville, complement) => run(`insert into LIEU (Ville, Complement) values ('${ville}', '${complement}')`),
};

module.exports.vehicule = {
    search: (marque, modele, annee) => get(`select Id_vehicule from VEHICULE where Marque = '${marque}' and  Modele = '${modele}' and Annee = ${annee} `),
    create: (marque, modele, annee) => run(`insert into VEHICULE (Marque, Modele, Annee) values ('${marque}', '${modele}', ${annee} )`),
    byId: id => get(`select Marque, Modele, Annee, Image from VEHICULE where Id_vehicule = ${id}`),
};

module.exports.message = {
    byUser: (id) => all(`select distinct Id_usr_expediteur, Message_text from Message where Id_usr_expediteur = ${id} or Id_usr_destinataire = ${id}`),
    byId: (id) => all(`select distinct Id_usr_expediteur, Id_usr_destinataire from Message where Id_usr_expediteur = ${id} or Id_usr_destinataire = ${id}`),
    getLastMessage: (id_usr, id_ami) => get(`SELECT Message_text, Heure FROM Message WHERE (Id_usr_expediteur = ${id_usr} or Id_usr_destinataire = ${id_usr}) and (Id_usr_expediteur = ${id_ami} or Id_usr_destinataire = ${id_ami}) Order by Heure DESC limit 1;`)
};
module.exports.passager = {
    create: (idUsr, idTrajet) => run(`insert into passager (Id_usr, Id_trajet) values (${idUsr}, ${idTrajet})`),
    byIds: (idUsr, idTrajet) => get(`select Id_usr from PASSAGER where Id_trajet =${idTrajet} and Id_usr=${idUsr}`),
}
