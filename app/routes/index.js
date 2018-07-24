/**
 * Created by Yuxin Wei on 2/27/2017.
 */



var express = require('express');
var router = express.Router();
var path = require('path');

router.get('/', function(req, res, next) {
    console.log('Enter Index Try:');
    res.sendFile(path.resolve('app/views/main.html'));
});

module.exports = router;
