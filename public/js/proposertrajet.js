'use strict';

import { renderTemplate, templates } from './templatefunction.js';

let context = {};
renderRechercherPage(context);

async function renderRechercherPage(context) {
    await renderTemplate(templates('/public/views/trajet/proposer-trajet.html'), context);

    const proposer = document.querySelector('#proposer-btn');

    proposer.addEventListener('click', function () {

        const lieu_depart = document.querySelector('#inputDeparture').value;
        const lieu_arrivee = document.querySelector('#inputArrival').value;
        const prix = document.querySelector('#inputPrix').value;
        const heure_depart = document.querySelector('#inputHour').value;
        const nbPlaces = document.querySelector("#inputPassagers").value;

        fetch('/api/propose-trajet', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            },
            method: 'POST',
            body: 'lieu_depart=' + lieu_depart + '&lieu_arrivee=' + lieu_arrivee + '&prix=' + prix + '&heure_depart=' + heure_depart + '&nbPlaces=' + nbPlaces,
        })
            .then(function (response) {
                if (response.ok) {
                    response.json()
                        .then((resp) => {
                            if (resp.success) {
                                document.location.href = '/trajet';
                            }
                            else {
                                console.log("erreur");
                                document.location.href = '/trajet'; 
                            }
                        });
                }
            });
    });
}