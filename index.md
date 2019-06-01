# PolyTransport


## Description

### Sujet

Projet Web correspondant au sujet n°1 : "Co-voiturage fin de soirée". Le site internet doit permettre la réservation d'un trajet de covoiturage entre 2 lieux différents avec une heure donnée. La base de données actuelles contient des noms de ville et non des lieux de Nantes et alentours (comme cela était demandés par le client. Mais la base de données qui a été conceptualisée ne le permettait pas).

### Réalisations

- Client : Groupe 3A
- Phase 1 - Designer : Groupe 3B
- Phase 2 - Conception : Groupe 3C
- Phase 3 - Développement : Groupe 3D

---

## Installation

### Téléchargement 

`git clone git@gitlab.univ-nantes.fr:E187321K/polytransport.git`

ou

`git clone https://gitlab.univ-nantes.fr/E187321K/polytransport.git`

### Base de données

Si besoin de regénérer la base de données, il est nécessaire d'avoir sqlite3.

`sudo apt-get install sqlite3`

puis 

`npm run createDB`

### node_modules

Pour télécharger les dépendances nécessaires, veuillez utiliser :

`npm install`

---

## Démarrage

Pour cela, il suffit très simplement de run :

`npm start`

Si aucune erreur, le site est accessible sur `127.0.0.1:8080`


## URL / API restful


### Les URLs de points d'entrée
* /3D/
* /3D/connexion/
* /3D/inscription/
* /3D/trajet/
* /3D/profil/
* /3D/messages/

### Les URLs de l'API

##### Requetes en post
* /connexion/
* /inscription/
* /trajet/reserver/
* /propose-trajet/
* /trajet/notification/


##### Requetes en get
* /profil/:id_usr/
* /trajet/:id_trajet/
* /search-trajet/:lieu_depart/:lieu_arrivee/:heure_depart/
* /messages/liste-discussions/
* /messages/discussion/:id_friend/

##### Requetes en put
* /profil/:id_usr/
    
### Dépendances

##### Côté client :
* Bootstrap
* Polyfills pour le support de fetch dans les vieux navigateurs
* jQuery 
* Mustache

##### Côté serveur :
* body-parser": "^1.19.0"
* connect-ensure-login": "^0.1.1",
* cookie-parser": "^1.4.4",
* express": "^4.16.4",
* express-session": "^1.16.1",
* node-fetch": "^2.6.0",
* nodemon": "^1.11.0",
* passport": "^0.4.0",
* passport-local": "^1.0.0",
* process": "^0.11.10",
* sqlite3": "^4.0.6"


## Equipe

**Groupe 3D :**
- Killian COUTY
- Florian DANIEL
- Clément GAUDUCHEAU
- Thomas PEUZIAT