export const templates = (() => {
    let templates = {};
    return function load(url) {
        if (templates[url]) {
            return Promise.resolve(templates[url]);
        }
        else {
            return fetch(url)
                .then(res => res.text())
                .then(text => {
                    return templates[url] = text;
                })
        }
    }
})();

// Fonction utilitaire qui permet de charger en parallèle les 
// différents "partial" (morceaux de template. Ex: header)
const loadPartials = (() => {
    let partials;

    return async function loadPartials() {
        if (!partials) {
            partials = {
                navbar: templates('/public/partials/navbar.mustache'),
                topbar: templates('/public/partials/topbar.mustache'), 
            };
            const promises = Object.entries(partials)
                .map(async function ([k, v]) {
                    return [k, await v];
                });
            partials = Object.fromEntries(await Promise.all(promises));
        }

        // TODO Modifier les partials pour avoir des variables ( https://stackoverflow.com/questions/15667011/is-it-possible-to-pass-variables-to-a-mustache-partial )
        return partials;
    }
})();

// fonction utilitaire de rendu d'un template
export async function renderTemplate(template, context) {
    // On charge les partials (si pas déà chargés)
    const partials = await loadPartials();
    // On rend le template
    const rendered = Mustache.render(await template, context, partials);
    //let html = document.querySelector('html');
    //html.innerHTML = rendered;
    let wrapper = document.querySelector('#wrapper');
    wrapper.innerHTML = rendered;

}