let express = require('express');
let router = express.Router();

router.get('/', function(req, res, next) {
        res.sendFile('signup.html',  {'root': 'public/views'});
});

router.post('/', function(req, res, next) {

});

module.exports = router;