let express = require('express');
let router = express.Router();

router.post('/', function(req, res, next) {

});

router.get('/', function (req, res, next) {
    res.redirect('/messages/liste-discussion/');
});

router.get('/liste-discussion/', function(req, res, next) {
    res.sendFile('liste-discussions.html',  {'root': 'public/views/message'});
});

router.get('/discussion/:id_friend/', function (req, res, next) {
    res.sendFile('discussion.html',  {'root': 'public/views/message'});
});

module.exports = router;