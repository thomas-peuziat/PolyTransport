'use strict';

import { renderTemplate, templates } from './templatefunction.js';

let context = {};
renderProposerPage(context);

async function renderProposerPage(context) {
    await renderTemplate(templates('/3D/public/views/trajet/proposer-trajet.mustache'), context);

    const proposer = document.querySelector('#proposer-btn');
    proposer.addEventListener('click', function () {

        const lieu_depart = document.querySelector('#inputDeparture').value;
        const lieu_arrivee = document.querySelector('#inputArrival').value;
        const prix = document.querySelector('#inputPrix').value;
        const heure_depart_non_parsed = document.querySelector('#inputHour').value;
        const heure_depart = parseInt(heure_depart_non_parsed[0] + heure_depart_non_parsed[1] + heure_depart_non_parsed[3] + heure_depart_non_parsed[4]);
        const nbPlaces = document.querySelector("#inputPassagers").value;

        fetch('/3D/api/propose-trajet', {
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
                                renderProposerPage({...context, messageValide: resp.messageValide});

                            }
                            else {
                                renderProposerPage({...context, messageErreur: resp.messageErreur});
                            }
                        });
                }
            });
    });
}