/* eslint-env node */
'use strict';

// Ce modules fournit quelques fonction pour simplifier l'accès
// à notre base de données sqlite

const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('./PolyTransport.db', sqlite3.OPEN_READWRITE, function (err) {
    if (err) {
        console.error(err + '\n' + 'run "npm run createDB" to create a database file');
        // Pas de problème pour faire un appel synchrone ici : on est dans la phase
        // d'initialisation du serveur et pas dans le traitement de requêtes.
        require('process').exit(-1);
    }
});
