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
    await renderTemplate(templates('/3D/public/views/message/discussion.html'), context);
}