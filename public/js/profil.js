'use strict';

import { renderTemplate, templates } from './templatefunction.js';

let context = {};
const id_usr = document.location.href.split('/').pop();
getInfoUser(id_usr, context);

async function getInfoUser(idUsr, context) {
    const response = await fetch('/api/profil/' + idUsr);
    if (context.message) {
        let msg = context.message;
        context = await response.json();
        context.message = msg;
    }
    else 
        context = await response.json();
    renderProfilPage(context);
}

async function renderProfilPage(context) {
    await renderTemplate(templates('/public/views/profil/profil.mustache'), context);
    const submit_btn = document.querySelector('.btn');

    const input_marque = document.querySelector('#inputMarque');
    input_marque.addEventListener('change', function () {
        const input_modele = document.querySelector('#inputModele');
        document.querySelector('#inputVoiture').value = input_marque.value + ' ~ ' + input_modele.value;
    });

    const input_modele = document.querySelector('#inputModele');
    input_modele.addEventListener('change', function () {
        const input_marque = document.querySelector('#inputMarque');
        document.querySelector('#inputVoiture').value = input_marque.value + ' ~ ' + input_modele.value;
    });

    const input_voiture = document.querySelector('#inputVoiture');
    input_voiture.value = input_marque.value + ' ~ ' + input_modele.value;

    submit_btn.addEventListener('click', function () {
        const nom = document.querySelector('#inputNameM').value;
        const prenom = document.querySelector('#inputPrenomM').value;
        const email = document.querySelector('#inputEmailM').value;
        const phone = document.querySelector('#inputPhoneM').value;
        const DDN = document.querySelector('#inputDdnM').value;
        const marque = document.querySelector('#inputMarque').value;
        const modele = document.querySelector('#inputModele').value;
        const annee = document.querySelector('#inputAnnee').value;

        // @TODO : Vehicule

        fetch('/api/profil/' + id_usr, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            },
            method: 'PUT',
            body: 'nom=' + nom + '&prenom=' + prenom + '&email=' + email + '&phone=' + phone
            + '&DDN=' + DDN + '&marque=' + marque + '&modele=' + modele + '&annee=' + annee,
        })
        .then(function (response) {
            if (response.ok) {
                response.json()
                .then((resp) => {
                    if (resp.success) {
                        getInfoUser(id_usr, {...context, message: resp.message});
                    }
                    else {
                        renderProfilPage({...context, message: resp.message});
                    }
                });
            }
    
        });
    });
}

