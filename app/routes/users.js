/**
 * Created by Yuxin Wei on 2/27/2017.
 */

var express = require('express');
var router = express.Router();
var models_Users = require('../model/users');
var User = models_Users.User;
var cors = require('cors');
var config = require('../config');

router.post('/login', function (req, res, next) {
    models_Users.Login(req, function (ress) {
        res.statusCode = ress;
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
        res.header("Content-Type", "application/json, text/plain, */*, application/json;charset=utf-8");
        res.send();
    });

});

router.post('/', function (req, res, next) {
    console.log("11");
    models_Users.Regist(req, function (ress) {
        res.statusCode = ress;
        res.send();
    });
});

router.get('/', function (req, res, next) {
    models_Users.RetrieveAll(function (callback) {
        res.send(callback);
    });
});


router.get('/list/active', function (req, res, next) {
    console.log("list active");
    models_Users.GetActive(function (cb) {
        res.send(cb)
    })
})

router.get('/list/inactive', function (req, res, next) {
    models_Users.GetInactive(function (cb) {
        res.send(cb)
    })
})

router.get('/:username', function (req, res, next) {
    models_Users.RetrieveOne(req.params.username, function (code, record) {
        res.statusCode = code;
        res.send(record);
    });
});

router.post('/logout', function (req, res, next) {
    models_Users.Logout(req.body.username, function (code) {
        res.statusCode = code;
        res.setHeader("Access-Control-Allow-Origin", config.address.URI);//"http://emergency-social-network.herokuapp.com"); //MARK
        res.send();
    });
});

router.post('/:username/status/:statusCode', function (req, res, next) {

    models_Users.SetStatus(req.params.username, req.params.statusCode, function (code) {
        res.statusCode = code;
        console.log("post status user name routes:" + req.params.username);
        console.log("post status status in routes:" + req.params.statusCode);
        res.send();
    });
});

router.get('/:username/status', function (req, res, next) {
    models_Users.GetStatus(req.params.username, function (code, record) {
        res.statusCode = code;
        console.log("get status user name routes:" + req.params.username + res.statusCode);
        res.send(record);
    });

});

router.post('/:username/choice/:choice', function (req, res, next) {

    models_Users.SetChoice(req.params.username, req.params.choice, function (code) {
        res.statusCode = code;
        console.log("post choice user name routes:" + req.params.username);
        console.log("post choice status in routes:" + req.params.choice);
        console.log("post code :" + res.statusCode);
        res.send();
    });
});

router.get('/:username/choice', function (req, res, next) {
    models_Users.GetChoice(req.params.username, function (code, record) {
        res.statusCode = code;
        console.log("code" + code + "record" + record);
        console.log("get choice user name routes:" + res.statusCode);
        res.send(record);
    });

});

router.put('/:userName/inactive', function (req, res, next) {
    models_Users.Deactive(req.params.userName, function (cb) {
        res.statusCode = cb;
        res.send();
    });
});

router.put('/:userName/active', function (req, res, next) {
    models_Users.Active(req.params.userName, function (cb) {
        res.statusCode = cb;
        res.send();
    });
});


router.put('/:userName', function (req, res, next) {
    models_Users.Update(req.params.userName, req, function (cb) {
        res.statusCode = cb;
        res.send();
    });
});

module.exports = router;