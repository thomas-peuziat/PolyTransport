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
    await renderTemplate(templates('/3D/public/views/message/liste-discussions.mustache'), context);
}