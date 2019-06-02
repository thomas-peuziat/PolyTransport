'use strict';

import { renderTemplate, templates } from './templatefunction.js';

let context = {};
const id_friend = document.location.href.split('/')[6];
renderDiscussionPage(context);
getMessages(id_friend, context);

async function getMessages(idFriend, context) {
    const response = await fetch('/3D/api/messages/discussion/' + idFriend + '/');
    let res = await response.json();
    context.message = res.message;
    renderDiscussionPage(context);
}

async function renderDiscussionPage(context) {
    await renderTemplate(templates('/3D/public/views/message/discussion.mustache'), context);

    const input_msg = document.querySelector("#input-msg");

    const input_send = document.querySelector('#envoi-msg');
    input_send.addEventListener('click', function() {
        if (input_msg.value !== '') {
            fetch('/3D/api/messages/discussion/' + id_friend + '/', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
                },
                method: 'POST',
                body: 'msg=' + encodeURIComponent(input_msg.value),
            })
            .then(function (response) {
                if (response.ok) {
                    response.json()
                    .then((resp) => {
                        if (resp.success) {
                            getMessages(id_friend, context);
                        }
                        else {
                            getMessages(id_friend, context);
                        }
                    });
                }
        
            });
        }
    });
}