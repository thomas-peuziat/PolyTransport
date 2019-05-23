'use strict';

import { renderTemplate, templates } from './templatefunction.mjs';

function conn() {
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
                    console.log('ok');
                }
                else {
                    renderTemplate(templates('/public/views/login1.html'), {});
                    console.log('nope');
                }
            });
            //console.log(response);
    
            
        }

    });   
}

conn();