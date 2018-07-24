'use strict';
var sd = require('silly-datetime');
var mongoose = require('mongoose');

//var User = require("./users");
class HelpProviderClass {
    constructor() {
        var Schema = mongoose.Schema;
        var helpProvider_schema = new Schema({
            username: {type: String, required: true},
            Address: {type: String, required: true},
            HelpType: {type: String, required: true},
            Comments: {type: String, required: true}
        });

        try {
            var HelpProviders = mongoose.model('HelpProviders');
        }
        catch (e) {
            var HelpProviders = mongoose.model('HelpProviders', helpProvider_schema);
        }

        this.HelpProviders = HelpProviders;
    }

    Post(req, callback) {
        var HelpProviders = this.HelpProviders;

        var time = sd.format(new Date());
        var data = {
            username: req.body.username,
            Address: req.body.Address,
            HelpType: req.body.HelpType,
            Comments: req.body.Comments
        };
        console.log("saveCheck1");
        var newProvider = new HelpProviders(data);
        if (req.body.username == null || req.body.username == "" ||
            req.body.Address == null || req.body.Address == "" ||
            req.body.HelpType == null || req.body.HelpType == "" ||
            req.body.Comments == null || req.body.Comments == "") {
            console.log("saveCheck2");
            return callback(404);
        }
        else {
            console.log("saveCheck3");
            newProvider.save();
            return callback(201);

        }

    }

    RetrieveAll(callback) {
        this.HelpProviders.find({}, function (err, docs) {
            callback(docs);
        })
    }

    /*    RetrieveOne(name, callback) {
     this.Messages.find({username: name}, function (err, docs) {
     if (docs.length == 0) callback(404, docs);
     else callback(200, docs);
     })
     }*/
}

module.exports = new HelpProviderClass();
