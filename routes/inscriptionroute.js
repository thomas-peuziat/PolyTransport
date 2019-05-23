let express = require('express');
let router = express.Router();
let fetch = require('node-fetch');

router.get('/', require('connect-ensure-login').ensureLoggedIn('/connexion'), function(res) {
        // @TODO : renderTemplate inscription
        res.redirect('/')
});

router.post('/', async function(req, res, next) {

});

module.exports = router;