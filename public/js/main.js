'use strict';
<!--    TODO :  Load les templates -->

page('/connexion', async function() {
    console.log('coc');
    let response;
    response = await fetch('api/connexion', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
        },
        method: 'POST',
        body: 'username=f&password=f',
    });
    console.log('coc');
    if (response.ok)
        console.log("ok");
    else
        console.log("nok");

});

// On démarre le routing
page.start();
