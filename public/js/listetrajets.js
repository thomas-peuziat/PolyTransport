'use strict';

import { renderTemplate, templates } from './templatefunction.js';

let context = {};
renderListeTrajetsPage(context);

async function renderListeTrajetsPage(context) {

    let url_string = window.location.href;
    let url = new URL(url_string);
    let lieu_depart =url.searchParams.get('lieu_depart');
    let lieu_arrivee =url.searchParams.get('lieu_arrivee');
    let heure_depart =url.searchParams.get('heure_depart');



    /*context = {
        trajets: [
            {
                conducteur: {
                    nom: 'NOM',
                    prenom: 'Prénom'
                },
                prix: 30,
                depart: {
                    lieu:'Beaujoire',
                    heure:'16:43'
                },
                arrivee: {
                    lieu:'Commerce',
                    heure:'17:43'
                },
                nbPlaces: 4
            },
            {
                conducteur: {
                    nom: 'HELO',
                    prenom: 'yo'
                },
                prix: 30,
                depart: {
                    lieu:'Beaujoire',
                    heure:'16:43'
                },
                arrivee: {
                    lieu:'Commerce',
                    heure:'17:43'
                },
                nbPlaces: 4
            }
        ]
    };*/

    fetch('/api/search-trajet', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        method: 'GET',
        body: 'lieu_depart=' + lieu_depart + '&lieu_arrivee=' + lieu_arrivee + '&heure_depart=' + heure_depart,
    })
        .then(function (response) {
        //console.log(response);
        //if (response.ok) {
            //response.json()
                //.then((resp) => {
                    if (response.success) {
                        context.trajets = response.trajets;
                        renderTemplate(templates('/public/views/trajet/liste-trajets.html'), context);
                    }
        })
        .then(function () {
            document.location.href = '/trajet/liste-trajets';
        });



    /*const search = document.querySelector('#search-btn');

    search.addEventListener('click', function () {

        const lieu_depart = document.querySelector('#inputDeparture').value;
        const lieu_arrivee = document.querySelector('#inputArrival').value;
        const date_depart = document.querySelector('#inputDate').value;
        const heure_depart = document.querySelector('#inputHour').value;

        fetch('/api/search-trajet', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            },
            method: 'POST',
            body: 'lieu_depart=' + lieu_depart + '&lieu_arrivee=' + lieu_arrivee + '&date_depart=' + date_depart + '&heure_depart=' + heure_depart,
        })
            .then(function (response) {
                if (response.ok) {
                    response.json()
                        .then((resp) => {
                            if (resp.success) {
                                document.location.href = '/trajet/liste-trajets' + '?lieu_depart=' + lieu_depart + '&lieu_arrivee=' + lieu_arrivee + '&date_depart=' + date_depart + '&heure_depart=' + heure_depart;
                            }
                            else {
                                console.log("erreur");
                                document.location.href = '/trajet/rechercher';
                            }
                        });
                }
            });
    });*/
}