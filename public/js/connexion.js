'use strict';

import { renderTemplate, templates } from './templatefunction.js';


renderLoginPage();

async function renderLoginPage() {
    await renderTemplate(templates('/public/views/login.html'),{});
    console.log(document.getElementById('subm'));
    
    const cancel_btn = document.getElementById('subm');
    console.log(cancel_btn);
    cancel_btn.addEventListener('click', function () {
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
            console.log(response)
            if (response.ok) {
                response.json()
                .then((resp) => {
                    if (resp.success) {
                        // @TODO : render template accueil-trajet
                        fetch('/inscription');
                        //renderTemplate(templates('/public/views/login1.html'), {});
                    }
                    else {
                        renderLoginPage();
                    }
                });
                //console.log(response);
        
                
            }
    
        });
    });
}