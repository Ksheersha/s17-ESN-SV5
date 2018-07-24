/**
 * Created by 32842 on 4/17/2017.
 */

var chatgroup = require('../model/chatgroup');
var express = require('express');
var router = express.Router();
var cors = require('cors');
var config = require('../config');
var groupchat_message = require('../model/groupchat_messages');
var models_Users = require('../model/users');
var User = models_Users.User;
router.get('/list', function (req, res, next) {
    chatgroup.list(function (doc) {
        res.statusCode = 200;
        res.send(doc);
    });
});

router.post('/', function (req, res, next) {
    chatgroup.create(req, function (doc) {
        res.statusCode = doc;
        res.send();
    });
});


router.post('/leave', function (req, res, next) {
    console.log("leave");
    chatgroup.leave(req, function (doc) {
        res.statusCode = doc;
        res.send();
    });
});


router.post('/enter', function (req, res, next) {
    console.log("enter");
    chatgroup.enter(req, function (doc) {
        res.statusCode = doc;
        res.send();
    });
});

router.post('/message', function (req, res, next) {
    groupchat_message.Send(req, function (doc) {
        res.statusCode = doc;
        res.send();
    });
});

router.get('/message/:groupname', function (req, res, next) {
    groupchat_message.RetrieveMessages(req, function (status, doc) {
        console.log("doc ", doc);
        res.statusCode = status;
        res.send(doc);

    });
});
module.exports = router;
