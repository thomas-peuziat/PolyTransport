let express = require('express');
let router = express.Router();

router.get('/', require('connect-ensure-login').ensureLoggedIn('/connexion'), function(req, res, next) {
        // @TODO : renderTemplate inscription
        res.sendFile('signup.html',  {'root': 'public/views/'});
});

router.post('/', function(req, res, next) {

});

module.exports = router;