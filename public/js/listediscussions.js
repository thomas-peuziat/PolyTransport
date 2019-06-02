'use strict';

import { renderTemplate, templates } from './templatefunction.js';

let context = {};
getMessages(context);

async function getMessages(context) {
    const response = await fetch('/3D/api/messages/liste-discussions/');
    context = await response.json();
    renderListeDiscussPage(context);
}

async function renderListeDiscussPage(context) {
    await renderTemplate(templates('/3D/public/views/message/liste-discussions.mustache'), context);
}