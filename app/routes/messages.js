/**
 * Created by Yuxin Wei on 2/27/2017.
 */

var express = require('express');
var router = express.Router();
var models_Messages = require('../model/messages');
var models_Announcements = require('../model/announcements');
var models_PrivateMessages = require('../model/private_messages');
var Messages = models_Messages.Messages;

router.post('/public', function (req, res, next) {
    models_Messages.Post(req, function (ress) {
        res.statusCode = ress;
        res.send();
    });


});


router.get('/public', function (req, res, next) {
    models_Messages.RetrieveAll(function (callback) {
        res.send(callback);
    });
});


router.get('/public/:username', function (req, res, next) {
    models_Messages.RetrieveOne(req.params.username, function (code, record) {
        res.statusCode = code;
        res.send(record);
    });
});


router.post('/private', function (req, res, next) {
    models_PrivateMessages.SendPrivate(req, function (code, record) {
        res.statusCode = code;
        res.send(record);
    });
});

router.get('/private/:userName1/:userName2', function (req, res, next) {
    models_PrivateMessages.RetrieveMessages(req, function (code, record) {
        res.statusCode = code;
        res.send(record);
    });
});

router.post('/announcements', function (req, res, next) {
    models_Announcements.Post(req, function (ress) {
        res.statusCode = ress;
        res.send();
    });


});

router.get('/announcements', function (req, res, next) {
    models_Announcements.RetrieveAll(function (callback) {
        res.send(callback);
    });
});


module.exports = router;
