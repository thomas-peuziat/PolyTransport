'use strict';

import { renderTemplate, templates } from './templatefunction.js';

let context = {};
renderRechercherPage(context);

async function renderRechercherPage(context) {
    await renderTemplate(templates('/public/views/trajet/rechercher-trajet.html'), context);

    const search = document.querySelector('#search-btn');

    search.addEventListener('click', function () {

        const lieu_depart = document.querySelector('#inputDeparture').value;
        const lieu_arrivee = document.querySelector('#inputArrival').value;
        //const date_depart = document.querySelector('#inputDate').value;
        const heure_depart = document.querySelector('#inputHour').value;

        document.location.href = '/trajet/liste-trajets' + '?lieu_depart=' + lieu_depart + '&lieu_arrivee=' + lieu_arrivee  + '&heure_depart=' + heure_depart;
    });
}

/*fetch('/api/search-trajet', {
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
    });*/
