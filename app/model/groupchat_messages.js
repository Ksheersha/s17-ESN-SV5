/**
 * Created by Yuxin Wei on 3/16/2017.
 */

'use strict';
var sd = require('silly-datetime');
var mongoose = require('mongoose');
var User = require("./users");
class groupchat_messages {
    constructor() {
        var Schema = mongoose.Schema;
        var groupchat_message_Schema = new Schema({
            username: {type: String, required: true},
            content: {type: String, required: true},
            timestamp: {type: Date, required: true},
            groupname: {type: String, required: true},
            status: {type: String},
            Location: {type: String},
            isPicture: {type: Boolean}
        });
        var groupchat_message = mongoose.model('groupchat_message', groupchat_message_Schema);
        this.groupchat_message = groupchat_message;
    }

    IfExist(req, callback) {
        var chatgroup = require('./chatgroup');
        var pd = 0;
        chatgroup.list(function (list) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].groupname == req) {
                    pd = 1;
                    break;
                }
            }
            if (pd == 1) return callback(1)
            else return callback(0);
        });
    }

    Send(req, callback) {
        var groupchat_message = this.groupchat_message;
        this.IfExist(req.body.groupname, function (res) {
            if (res) {
                var time = sd.format(new Date());
                var data;
                if (req.body.Location != undefined) {
                    data = {
                        groupname: req.body.groupname,
                        username: req.body.username,
                        content: req.body.content,
                        timestamp: time,
                        status: req.body.status,
                        Location: req.body.Location,
                        isPicture: req.body.isPicture
                    }
                }
                else data = {
                    groupname: req.body.groupname,
                    username: req.body.username,
                    content: req.body.content,
                    timestamp: time,
                    status: req.body.status,
                    isPicture: req.body.isPicture
                }
                var newgroupchat_message = new groupchat_message(data);
                newgroupchat_message.save();
                callback(201);
            }
            else return callback(404);
        })

    }


    RetrieveMessages(req, callback) {
        var groupchat_message = this.groupchat_message;
        var groupname = req.params.groupname;
        this.IfExist(groupname, function (cb) {
            if (cb == 0) {
                return callback(404);
            }
            else {
                groupchat_message.find({groupname: groupname},null,{'timestamp':-1}, function (err, doc) {
                    console.log(doc);
                    return callback(200, doc);

                })
            }
        });

    }
}
module.exports = new groupchat_messages();
