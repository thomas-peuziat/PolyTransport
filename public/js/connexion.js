'use strict';

import { renderTemplate, templates } from './templatefunction.js';

let context = {};
renderLoginPage(context);

async function renderLoginPage(context) {
    await renderTemplate(templates('/public/views/login.html'), context);
    
    const submit_btn = document.querySelector('#login-btn');

    submit_btn.addEventListener('click', function () {
        const username = document.querySelector('#inputEmail').value;
        const password = document.querySelector('#inputPassword').value;
        fetch('/api/connexion', {
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
                        //renderTemplate(templates('/public/views/signup.html'), {});
                        // fetch('/connexion', {
                        //     headers: {
                        //         'Accept': 'application/json',
                        //         'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                        //     },
                        //     method: 'POST',
                        // }).then(res => res);
                        document.location.href = '/trajet/accueil';
                    }
                    else {
                        renderLoginPage({...context, message: resp.message});
                    }
                });
                //console.log(response);
        
                
            }
    
        });
    });
}