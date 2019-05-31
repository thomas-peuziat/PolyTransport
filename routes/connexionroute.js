let express = require('express');
let router = express.Router();

router.post('/', function(req, res, next) {

});

router.get('/', function(req, res, next) {
    res.sendFile('login.html',  {'root': 'public/views'});
});

module.exports = router;