'use strict';


import { renderTemplate, templates } from './templatefunction.js';

let context = {};
renderDetailTrajetPage(context);

async function renderDetailTrajetPage(context) {

    let url_string = window.location.href;
    let url = new URL(url_string);
    let id_trajet =url.searchParams.get('id_trajet');
    let trajet;
    context = {
        message:''
    };

    fetch('/3D/api/trajet/' + id_trajet, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        method: 'GET',
    })
        .then(function (responseTrajet) {
            if (responseTrajet.ok) {
                responseTrajet.json()
                    .then((respTrajet) => {
                        if (respTrajet.success) {
                            context.trajet = respTrajet.trajet;
                            trajet = respTrajet.trajet;
                            return renderTemplate(templates('/3D/public/views/trajet/details-trajet.mustache'), context);
                        } else {
                            context.message = respTrajet.message;
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
                                .then(function (responseReservation) {
                                    if (responseReservation.ok) {
                                        responseReservation.json()
                                            .then((respReservation) => {
                                                if (respReservation.success) {
                                                    fetch('/3D/api/trajet/notification/', {
                                                        headers: {
                                                            'Accept': 'application/json',
                                                            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                                                        },
                                                        method: 'POST',
                                                        body: 'id_destinataire=' + trajet.conducteur.id + '&id_trajet=' + id_trajet,
                                                    })
                                                        .then(function (responseNotification) {
                                                            if (responseNotification.ok) {
                                                                responseNotification.json()
                                                                    .then((respNotification) => {
                                                                        if(respNotification.success) {
                                                                            renderTemplate(templates('/3D/public/views/trajet/details-trajet.mustache'), {...context, messageValide: respNotification.messageValide});
                                                                        } else {
                                                                            renderTemplate(templates('/3D/public/views/trajet/details-trajet.mustache'), {...context, messageErreur: respNotification.messageErreur});
                                                                        }
                                                                    })
                                                            } else {
                                                                renderTemplate(templates('/3D/public/views/trajet/details-trajet.mustache'), {...context, messageValide: respReservation.messageValide});
                                                            }
                                                        })
                                                }
                                                else {
                                                    renderTemplate(templates('/3D/public/views/trajet/details-trajet.mustache'), {...context, messageErreur: respReservation.messageErreur});
                                                }
                                            });
                                    }
                                });
                        });
                    });
            }
        });



}