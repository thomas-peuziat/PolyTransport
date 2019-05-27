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
        const date_depart = document.querySelector('#inputDate').value;
        const heure_depart = document.querySelector('#inputHour').value;
        const nbPassagers = document.querySelector("#inputPassagers").value;

        fetch('/api/propose-trajet', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            },
            method: 'POST',
            body: 'lieu_depart=' + lieu_depart + '&lieu_arrivee=' + lieu_arrivee + '&date_depart=' + date_depart + '&heure_depart=' + heure_depart + '&nbPassagers=' + nbPassagers,
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
                                document.location.href = ''; //renvoyer à l'accueil
                            }
                        });
                }
            });
    });
}