let express = require('express');
let router = express.Router();

router.post('/', function(req, res, next) {

});

router.get('/', function(req, res, next) {
    res.redirect('/3D/profil/' + req.session.passport.user + '/');
});

router.get('/:id_usr/', function(req, res, next) {
    if (req.params.id_usr == req.session.passport.user) {
        res.sendFile('profil.html',  {'root': 'public/views/profil'});
    }
    else {
        req.logOut();
        res.redirect('/3D/connexion/');
    }
});

module.exports = router;