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
    console.log(context);
    await renderTemplate(templates('/public/views/profil/profil.html'), context);

    const submit_btn = document.querySelector('.btn');

    submit_btn.addEventListener('click', function () {
        const nom = document.querySelector('#inputNameM').value;
        const prenom = document.querySelector('#inputPrenomM').value;
        const email = document.querySelector('#inputEmailM').value;
        const phone = document.querySelector('#inputPhoneM').value;
        const DDN = document.querySelector('#inputDdnM').value;
        // @TODO : Vehicule

        fetch('/api/profil/' + id_usr, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            },
            method: 'PUT',
            body: 'nom=' + nom + '&prenom=' + prenom + '&email=' + email + '&phone=' + phone
            + '&DDN=' + DDN,
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

