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
                            console.log(context.trajet);
                            return renderTemplate(templates('/public/views/trajet/details-trajet.html'), context);
                        } else {
                            context.message = resp.message;
                            return renderTemplate(templates('/public/views/trajet/details-trajet.html'), context);
                        }
                    }).then(()=>{
                        const reserver = document.querySelector('#reservation');
                        reserver.addEventListener('click', function () {
                            fetch('/api/trajet/reserver', {
                                headers: {
                                    'Accept': 'application/json',
                                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                                },
                                method: 'POST',
                                body: 'id_trajet=' + id_trajet, 
                            })
                                .then(function (response) {
                                    if (response.ok) {
                                        response.json()
                                            .then((resp) => {
                                                if (resp.success) {
                                                    renderTemplate(templates('/public/views/trajet/details-trajet.html'), {...context, messageValide: resp.messageValide});
                    
                                                }
                                                else {
                                                    renderTemplate(templates('/public/views/trajet/details-trajet.html'), {...context, messageErreur: resp.messageErreur});
                                                }
                                            });
                                    }
                                });
                        });
                    });
            }
        });



}