'use strict';

import { renderTemplate, templates } from './templatefunction.js';

let context = {};
renderRechercherPage(context);

async function renderRechercherPage(context) {
    await renderTemplate(templates('/3D/public/views/trajet/rechercher-trajet.mustache'), context);

    const search = document.querySelector('#search-btn');

    search.addEventListener('click', function () {

        const lieu_depart = document.querySelector('#inputDeparture').value;
        const lieu_arrivee = document.querySelector('#inputArrival').value;

        const nonParsedHeure_depart = document.querySelector('#inputHour').value;
        const numHeure_depart = parseInt(nonParsedHeure_depart[0] + nonParsedHeure_depart[1] + nonParsedHeure_depart[3] + nonParsedHeure_depart[4]);

        document.location.href = '/3D/trajet/liste-trajets' + '?lieu_depart=' + lieu_depart + '&lieu_arrivee=' + lieu_arrivee  + '&heure_depart=' + numHeure_depart;
    });
}