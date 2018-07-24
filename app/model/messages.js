/**
 * Created by Yuxin Wei on 2/27/2017.
 */


'use strict';
var sd = require('silly-datetime');
var mongoose = require('mongoose');
var User = require("./users");
class MessageClass {
    constructor() {
        var Schema = mongoose.Schema;
        var Messages_Schema = new Schema({
            username: {type: String, required: true},
            content: {type: String, required: true},
            timestamp: {type: Date},
            status: {type: String},
            location: {type: String},
            isPicture: {type: Boolean}
        });
        var Messages = mongoose.model('Messages', Messages_Schema);
        this.Messages = Messages;
    }

    Post(req, callback) {
        var Messages = this.Messages;
        User.IfExist(req.body.username, function (res) {
            if (res) {
                var time = sd.format(new Date());
                var data = {
                    username: req.body.username,
                    content: req.body.content,
                    status: req.body.status,
                    timestamp: time,
                    isPicture: req.body.isPicture
                }
                var newMessage = new Messages(data);
                newMessage.save();
                callback(201);
            }
            else {
                callback(404);
            }
        });

    }

    RetrieveAll(callback) {
        this.Messages.find({},null,{'timestamp':-1}, function (err, docs) {
            callback(docs);
        })
    }

    RetrieveOne(name, callback) {
        this.Messages.find({username: name}, function (err, docs) {
            if (docs.length == 0) callback(404, docs);
            else callback(200, docs);
        })
    }
}

module.exports = new MessageClass();
