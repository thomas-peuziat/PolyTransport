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

    fetch('/3D/api/trajet/' + id_trajet, {
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
                            return renderTemplate(templates('/3D/public/views/trajet/details-trajet.mustache'), context);
                        } else {
                            context.message = resp.message;
                            return  renderTemplate(templates('/3D/public/views/trajet/details-trajet.mustache'), context);
                        }
                    }).then(()=>{
                        const reserver = document.querySelector('#reservation');
                        reserver.addEventListener('click', function () {
                            fetch('/3D/api/trajet/reserver/', {
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
                                                    renderTemplate(templates('/3D/public/views/trajet/details-trajet.mustache'), {...context, messageValide: resp.messageValide});
                    
                                                }
                                                else {
                                                    renderTemplate(templates('/3D/public/views/trajet/details-trajet.mustache'), {...context, messageErreur: resp.messageErreur});
                                                }
                                            });
                                    }
                                });
                        });
                    });
            }
        });



}