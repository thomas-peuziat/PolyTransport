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

    context = {
        trajets:[],
        message:''
    };

    fetch('/api/search-trajet/' + lieu_depart + '/' + lieu_arrivee + '/' + heure_depart, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        method: 'GET',
    })
        .then(function (response) {
            if (response.ok) {
                response.json()
                    .then((resp) => {
                        if (resp.success) {
                            context.trajets = resp.trajets;
                            renderTemplate(templates('/public/views/trajet/liste-trajets.mustache'), context);
                        } else {
                            context.message = resp.message;
                            renderTemplate(templates('/public/views/trajet/liste-trajets.mustache'), context);
                        }
                    });
            }
        })
}