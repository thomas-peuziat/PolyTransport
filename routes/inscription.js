let express = require('express');
let router = express.Router();
let fetch = require('node-fetch');
var isLog = require('./index').isLog;

router.get('/', require('connect-ensure-login').ensureLoggedIn(), function(res) {
        // @TODO : renderTemplate inscription
        console.log('Inscription')
});

router.post('/', async function(req, res, next) {

});