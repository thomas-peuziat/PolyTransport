'use strict';

import { renderTemplate, templates } from './templatefunction.js';

let context = {};
renderLoginPage(context);

async function renderLoginPage(context) {
    await renderTemplate(templates('/public/views/login.html'), context);
    
    const submit_btn = document.querySelector('.btn');

    submit_btn.addEventListener('click', function () {
        console.log(document.body);
        const username = document.querySelector('#inputEmail').value;
        console.log(username);
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
            console.log(response);
            if (response.ok) {
                response.json()
                .then((resp) => {
                    if (resp.success) {
                        // @TODO : render template accueil-trajet
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