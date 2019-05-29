'use strict';

import { renderTemplate, templates } from './templatefunction.js';

let context = {};
renderLoginPage(context);

async function renderLoginPage(context) {
    await renderTemplate(templates('/3D/public/views/login.mustache'), context);
    
    const submit_btn = document.querySelector('#login-btn');

    submit_btn.addEventListener('click', function () {
        const username = document.querySelector('#inputEmail').value;
        const password = document.querySelector('#inputPassword').value;
        fetch('/3D/api/connexion', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
            },
            method: 'POST',
            body: 'username=' + username + '&password=' + password,
        })
        .then(function (response) {
            if (response.ok) {
                response.json()
                .then((resp) => {
                    if (resp.success) {
                        document.location.href = '/3D/trajet/accueil';
                    }
                    else {
                        renderLoginPage({...context, message: resp.message});
                    }
                });
            }
        });
    });
}