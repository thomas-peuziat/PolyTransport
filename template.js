'use strict';

let Mustache = require('mustache');
let fetch = require('node-fetch');
let fromEntries = require('object.fromentries');

exports.templates = async function (url) {
    return fetch(url)
        .then(res => {
            return res.text();

        })
        .then(body => {
            //console.log(body);
            return body;
        });
};


exports.loadPartials = (() => {
    let partials;
    return async function loadPartials() {
        if (!partials) {
            partials = {
                navbar: exports.templates('http://127.0.0.1:8080/public/templates/navbar.mustache')
            };

            const promises = Object.entries(partials)
                .map(async function ([k, v]) {
                    return [k, await v];
                });
            partials = fromEntries(Object.entries(await Promise.all(promises)));
        }
        return partials;
    };
})();


exports.renderTemplate  = async function (template, context) {
    // On charge les partials (si pas déà chargés)
    const partials = await exports.loadPartials();
    //console.log(partials[0][0]);
    // On rend le template

    return (Mustache.render(await template, context, {
        navbar: partials[0][1]
    }));
};