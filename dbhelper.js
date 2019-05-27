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
        console.log(sql);
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
    create: (nom, prenom, email, phone, photo, password) => run(`insert into UTILISATEUR (Telephone, Mail, Nom, Prenom, MDP, Image) values ('${phone}', '${email}', '${nom}', '${prenom}', '${password}', '${photo}')`),
};

module.exports.trajets = {
    //@TODO byHeure, byId, byEtat, byLieuDepart, byLieuArrivee, byConducteur
};

