'use strict';

import { renderTemplate, templates } from './templatefunction.js';

let context = {};
getMessages(context);

async function getMessages(context) {
    const response = await fetch('/3D/api/messages/liste-discussions/');
    if (context.message) {
        let msg = context.message;
        context = await response.json();
        context.message = msg;
    }
    else 
        context = await response.json();
        renderListeDiscussPage(context);
}

async function renderListeDiscussPage(context) {
    //console.log(context);
    await renderTemplate(templates('/3D/public/views/message/liste-discussions.html'), context);
    
    // const submit_btn = document.querySelector('.btn');

    // submit_btn.addEventListener('click', function () {
    //     const nom = document.querySelector('#inputNomSU').value;
    //     const prenom = document.querySelector('#inputPrenomSU').value;
    //     const email = document.querySelector('#inputEmailSU').value;
    //     const phone = document.querySelector('#inputPhoneSU').value;
    //     const photo = document.querySelector('#inputPhotoSU').value;
    //     const password = document.querySelector('#inputPasswordSU').value;
    //     const passwordVerif = document.querySelector('#inputPasswordVerifSU').value;

    //     fetch('/api/inscription', {
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
    //         },
    //         method: 'POST',
    //         body: 'nom=' + nom + '&prenom=' + prenom + '&email=' + email + '&phone=' + phone
    //         + '&photo=' + photo + '&password=' + password + '&passwordVerif=' + passwordVerif,
    //     })
    //     .then(function (response) {
    //         console.log(response)
    //         if (response.ok) {
    //             response.json()
    //             .then((resp) => {
    //                 if (resp.success) {
    //                     document.location.href = '/connexion';
    //                 }
    //                 else {
    //                     renderSignupPage({...context, message: resp.message});
    //                 }
    //             });
    //         }
    
    //     });
    // });
}