var express = require('express');
var router = express.Router();
var models_HelpProvider = require('../model/helpprovider');
var HelpProvider = models_HelpProvider.HelpProvider;

router.post('/registerhelp', function (req, res, next) {
    models_HelpProvider.Post(req, function (ress) {
        res.statusCode = ress;
        console.log("register help post");
        res.send();
    });
});


router.get('/gethelp', function (req, res, next) {
    models_HelpProvider.RetrieveAll(function (callback) {
        res.send(callback);
    });
});


module.exports = router;
