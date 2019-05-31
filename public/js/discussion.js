'use strict';

import { renderTemplate, templates } from './templatefunction.js';

let context = {};
const id_friend = document.location.href.split('/')[6];
//console.log(context);
renderDiscussionPage(context)
getMessages(id_friend, context);

async function getMessages(idFriend, context) {
    const response = await fetch('/3D/api/messages/discussion/' + idFriend + '/');
    let res = await response.json();
    context.message = res.message;
    console.log(context);
    renderDiscussionPage(context);
}

async function renderDiscussionPage(context) {
    // let ctx = {};
    // ctx.message = [
    //     {me: {text: 'ça va ?'},},
    // ];
    // console.log(ctx);
    await renderTemplate(templates('/3D/public/views/message/discussion.html'), context);
}