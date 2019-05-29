'use strict';


import { renderTemplate, templates } from './templatefunction.js';

let context = {};
renderDetailTrajetPage(context);

async function renderDetailTrajetPage(context) {




    let url_string = window.location.href;
    let url = new URL(url_string);
    let id_trajet =url.searchParams.get('id_trajet');

    context = {
        //trajets:[],
        message:''
    };

    fetch('/api/trajet/' + id_trajet, {
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
                            context.trajet = resp.trajet;
                            renderTemplate(templates('/public/views/trajet/details-trajet.mustache'), context);
                        } else {
                            context.message = resp.message;
                            renderTemplate(templates('/public/views/trajet/details-trajet.mustache'), context);
                        }
                    });
            }
        })
}